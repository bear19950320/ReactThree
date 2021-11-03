// import { createBrowserHistory, createHashHistory  }  from 'history'
// import { connectRouter } from 'connected-react-router'
// import {routerMiddleware} from 'react-router-redux'
import {init} from '@rematch/core'
import models from './models';
// export const history = createBrowserHistory();

// export const hashHistory = createHashHistory();

// const middleware = routerMiddleware(history)

const store = init({
  models,
  redux: {
    // reducers: {
    //   router: connectRouter(history)
    // },
    // middlewares: [middleware]
  }
})

export default store
