import { Router } from 'express';
import request from 'request';
import * as CategoryRoutes from './app/services/Category';
import * as ReviewRoutes from './app/services/Review';

const routes = new Router();

function userAuthentication(req, res, next) {
  //Checking for the presence of an Authorization header
  if (!req.header('Authorization')) {
    res.json({ Error: 'Missing authorization token' });
  }

  //User service URL at get user status route
  const url = 'http://pax-user.herokuapp.com/auth/status';

  //Set header with authorization token received
  const headers = {
    Authorization: String(req.header('Authorization')),
  };

  request(
    { headers: headers, url: url, method: 'GET' },
    (error, response, body) => {
      if (error) {
        res.send(error);
      }

      //If received response is not success, then send forbidden status
      if (JSON.parse(body)['message'] != 'success') {
        res.sendStatus(403);
      }

      //Else means authorized request, go to next step of the chain
      next();
    }
  );
}

//Protected route with authentication step
routes.post('/provider_registration', userAuthentication, (req, res) => {
  //User service URL at provider_registration route
  const url = 'http://pax-user.herokuapp.com/provider_registration';
  request(
    {
      url: url,
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      json: JSON.parse(JSON.stringify(req.body)), //Sending received JSON
    },
    (error, response, body) => {
      if (error) {
        res.send(error);
      }
      res.send(body);
    }
  );
});

//Unprotected route, no authentication step
routes.get('/provider_by_category', (req, res) => {
  //Passing category id to URL
  const url =
    'http://pax-user.herokuapp.com/provider_by_category/' + req.query.id;

  //GET Request to User service
  request({ url: url, method: 'GET' }, (error, response, body) => {
    if (error) {
      res.send(error);
    }

    res.json(JSON.parse(body));
  });
});
//Category
routes.get('/api/v1/category/general', CategoryRoutes.getGeneralCategories);
routes.get('/api/v1/category/provider', CategoryRoutes.getProviderCategories);
routes.get(
  '/api/v1/category/provider/:general_category_id',
  CategoryRoutes.getProviderCategories
);

//Review
routes.get(
  '/api/v1/review/service_reviews/average/:evaluated_id',
  ReviewRoutes.getServiceReviewAverage
);
routes.get(
  '/api/v1/review/charisma_reviews/average/:evaluated_id',
  ReviewRoutes.getCharismaReviewAverage
);

export default routes;
