import React, { useContext, useEffect, useState } from 'react';
import PlanetsContext from '../context/planetsContext';

function Table() {
  const { planets, headers, nameFilter, filterList } = useContext(PlanetsContext);
  const [filteredPlanets, setFilteredPlanets] = useState(planets);
  // console.log(filterList);

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
    setFilteredPlanets(filteredByName);
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
