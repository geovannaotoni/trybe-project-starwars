import React, { useContext, useEffect, useState } from 'react';
import PlanetsContext from '../context/planetsContext';

function Table() {
  const { planets, headers, nameFilter, filterList } = useContext(PlanetsContext);
  const [filteredPlanets, setFilteredPlanets] = useState(planets);
  // console.log(filterList);

  useEffect(() => {
    // filtra a partir do nome digitado no input de nome (utilizando toLowerCase para não ser case-sensitive)
    let filterByName = planets
      .filter(({ name }) => name.toLowerCase().includes(nameFilter.toLowerCase()));

    // filtra a partir da lista de filtros de valores
    if (filterList.length > 0) {
      const { column, comparison, value } = filterList[0]; // por enquanto estou fazendo só do primeiro elemento do array filterList
      filterByName = filterByName.filter((planet) => {
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
    }
    setFilteredPlanets(filterByName);
  }, [planets, nameFilter, filterList]);

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
              {(Object.values(planet)).map((item, index) => (
                <td key={ index }>{ item }</td>
              ))}
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}

export default Table;
