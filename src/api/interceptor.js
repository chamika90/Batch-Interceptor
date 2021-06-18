import uniq from 'lodash/uniq';
import httpAdapter from 'axios/lib/adapters/http';
let batchRequests = [];
let batchRequestPromise = null;

/*
   Resolver to call for each request made by client
*/
const interceptResolver = request => {
  return (
    res => {
      const ids = (request.params || {}).ids || [];
      let data = res.data;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      const items = (data.items || []).filter(d => ids.indexOf(d.id) > -1);

      if (!items.length) {
        return Promise.reject(new Error('Items not available!'));
      }
      return Promise.resolve({...res, data: {items}});
    },
    error => Promise.reject(error)
  );
};

/*
   Generate config before sending the actual request.
   This will get all file ids passed through the requests in the specified time period.
*/
const getBatchConfig = config => {
  const batchedIds = batchRequests.reduce((idArray, req) => {
    const ids = (req.params || {}).ids;

    return uniq([...idArray, ...ids]);
  }, []);

  if (!batchedIds.length) {
    return config;
  }
  // return new config
  return {...config};
};

/*
   Adaptor to mock the default http adapter
*/
const batchAdapter = config => {
  if (!batchRequests.length) {
    batchRequestPromise = new Promise((resolve, reject) => {
      let timeout = setTimeout(() => {
        httpAdapter(getBatchConfig(config))
          .then(resolve)
          .catch(reject)
          .finally(() => {
            batchRequests = [];
            clearTimeout(timeout);
          });
      }, 1000);
    });
  }

  batchRequests.push(config);

  return batchRequestPromise;
};

function batchInterceptor(instance) {
  instance.interceptors.request.use(
    req => {
      // Mock adaptor to prevent initiating multiple requests
      req.adapter = config =>
        batchAdapter(config).then(interceptResolver(config));
      return req;
    },
    error => Promise.reject(error),
  );

  instance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      Promise.reject(error);
    },
  );
}
export default batchInterceptor;
