import React, { useContext } from 'react';
import PlanetsContext from '../context/planetsContext';

function Filters() {
  const { setNameFilter } = useContext(PlanetsContext);
  return (
    <section>
      <input
        type="text"
        data-testid="name-filter"
        placeholder="Filtre por Nome"
        onChange={ ({ target }) => setNameFilter(target.value) }
      />
    </section>
  );
}

export default Filters;
