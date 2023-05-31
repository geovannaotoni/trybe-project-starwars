import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import PlanetsContext from './planetsContext';
import fetchApi from '../services/fetchApi';

function PlanetsProvider({ children }) {
  const [planets, setPlanets] = useState([]);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    const setDataAPI = async () => {
      const dataApi = await fetchApi('https://swapi.dev/api/planets');
      // console.log(dataApi);
      setPlanets(dataApi);
      setHeaders(Object.keys(dataApi[0]));
    };
    setDataAPI();
  }, []);

  const valueContext = {
    planets,
    headers,
  };

  return (
    <PlanetsContext.Provider value={ valueContext }>
      {children}
    </PlanetsContext.Provider>
  );
}

PlanetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PlanetsProvider;
