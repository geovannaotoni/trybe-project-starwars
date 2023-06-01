import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import PlanetsContext from './planetsContext';
import fetchApi from '../services/fetchApi';

function PlanetsProvider({ children }) {
  const [planets, setPlanets] = useState([]); // array de objetos em que cada objeto é um planeta vindo da API
  const [headers, setHeaders] = useState([]); // array de strings em que cada string é uma chave dos objetos planetas
  const [nameFilter, setNameFilter] = useState(''); // string dos caracteres digitados no input de filtro de nome
  const [filterList, setFilterList] = useState([]); // array de objetos em que cada objeto é um filtro de valor
  const [sortPlanets, setSortPlanets] = useState({}); // objeto para o filtro de ordenação, conterá as chaves column e sort

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
    nameFilter,
    setNameFilter,
    filterList,
    setFilterList,
    sortPlanets,
    setSortPlanets,
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
