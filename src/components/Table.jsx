import React, { useContext } from 'react';
import PlanetsContext from '../context/planetsContext';

function Table() {
  const { planets, headers } = useContext(PlanetsContext);
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
          planets.map((planet) => (
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
