import React, { useContext, useEffect, useState } from 'react';
import PlanetsContext from '../context/planetsContext';

function Table() {
  const { planets, headers, nameFilter } = useContext(PlanetsContext);
  const [filteredPlanets, setFilteredPlanets] = useState(planets);

  useEffect(() => {
    const filterByName = planets
      .filter(({ name }) => name.toLowerCase().includes(nameFilter.toLowerCase()));
    setFilteredPlanets(filterByName);
  }, [planets, nameFilter]);

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
