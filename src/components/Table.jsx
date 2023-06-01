import React, { useContext, useEffect, useState } from 'react';
import PlanetsContext from '../context/planetsContext';

function Table() {
  const {
    planets,
    headers,
    nameFilter,
    filterList,
    sortPlanets,
  } = useContext(PlanetsContext);
  const [filteredPlanets, setFilteredPlanets] = useState(planets);
  // console.log(sortPlanets);

  useEffect(() => {
    // filtra a partir do nome digitado no input de nome (utilizando toLowerCase para não ser case-sensitive)
    let filteredByName = planets
      .filter(({ name }) => name.toLowerCase().includes(nameFilter.toLowerCase()));

    // filtra a partir da lista de filtros de valores
    if (filterList.length > 0) {
      // o .forEach percorre cada objeto do array filterList (array de objetos, cujos objetos possuem as chaves column, comparison, value)
      // dentro do .forEach, cada planeta do array filteredByName é percorrido pelo .filter, realizando a verificação do switch e retornando o planeta caso a verificação de comparison seja true
      filterList.forEach(({ column, comparison, value }) => {
        filteredByName = filteredByName.filter((planet) => {
          switch (comparison) {
          case 'maior que':
            return Number(planet[column]) > Number(value);
          case 'menor que':
            return Number(planet[column]) < Number(value);
          case 'igual a':
            return Number(planet[column]) === Number(value);
          default:
            return false;
          }
        });
      });
    }
    // ordena de acordo com a coluna selecionada e com o tipo de ordenação
    if (sortPlanets.column) {
      // console.log(sortPlanets);
      const planetsWithUnknown = [];
      const planetsWithValues = [];
      filteredByName.forEach((planet) => {
        if (planet[sortPlanets.column] === 'unknown') {
          planetsWithUnknown.push(planet);
        } else {
          planetsWithValues.push(planet);
        }
      });
      // console.log(planetsWithUnknown, planetsWithValues);
      if (sortPlanets.sort === 'ASC') {
        planetsWithValues
          .sort((a, b) => Number(a[sortPlanets.column]) - Number(b[sortPlanets.column]));
      }
      if (sortPlanets.sort === 'DESC') {
        planetsWithValues
          .sort((a, b) => Number(b[sortPlanets.column]) - Number(a[sortPlanets.column]));
      }
      filteredByName = [
        ...planetsWithValues,
        ...planetsWithUnknown,
      ];
    }
    setFilteredPlanets(filteredByName);
  }, [planets, nameFilter, filterList, sortPlanets]);

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={ header }>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {
          filteredPlanets.map((planet) => (
            <tr key={ planet.name }>
              {(Object.values(planet)).map((item, index) => {
                if (index === 0) {
                  return (
                    <td key={ index } data-testid="planet-name">{ item }</td>
                  );
                }
                return (
                  <td key={ index }>{ item }</td>
                );
              })}
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}

export default Table;
