import React, { useContext, useState } from 'react';
import PlanetsContext from '../context/planetsContext';

function Filters() {
  const {
    setNameFilter,
    setFilterList, // função que seta o array de filtros (é um array de objetos em que cada objeto é um filtro)
    filterList,
  } = useContext(PlanetsContext);

  // constante com as dropdown lists para cada input
  const columns = [
    'population', 'orbital_period', 'diameter', 'rotation_period', 'surface_water',
  ];
  const comparisons = ['maior que', 'igual a', 'menor que'];

  // cria um state local que é um objeto contendo os valores dos filtros de coluna, comparação e valor
  const [numberFilter, setNumberFilter] = useState({
    column: 'population',
    comparison: 'maior que',
    value: 0,
  });

  // ao digitar no input, altera-se o valor do state local numberFilter, sem perder os demais dados desse state (utlizando o ...prevNumberFilter)
  const handleChange = ({ target: { name, value } }) => {
    setNumberFilter((prevNumberFilter) => ({
      ...prevNumberFilter,
      [name]: value,
    }));
  };

  // ao clicar no botão de filtrar, ele seta no array FilterList o objeto contendo os dados de coluna, comparação e valor
  const handleClick = () => {
    // console.log(numberFilter);
    setFilterList((prevFilter) => ([
      ...prevFilter,
      numberFilter,
    ]));
  };

  return (
    <section>
      <article>
        <input
          type="text"
          data-testid="name-filter"
          placeholder="Filtre por Nome"
          onChange={ ({ target }) => setNameFilter(target.value) }
        />
      </article>
      <article>
        <label htmlFor="column-filter">
          Coluna:
          <select
            name="column"
            id="column-filter"
            data-testid="column-filter"
            value={ numberFilter.column }
            onChange={ handleChange }
          >
            {columns.map((col) => (
              <option value={ col } key={ col }>
                {col}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="comparison-filter">
          Operador:
          <select
            name="comparison"
            id="comparison-filter"
            data-testid="comparison-filter"
            value={ numberFilter.comparison }
            onChange={ handleChange }
          >
            {comparisons.map((comp) => (
              <option value={ comp } key={ comp }>
                {comp}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="value-filter">
          Valor:
          <input
            type="number"
            name="value"
            id="value-filter"
            data-testid="value-filter"
            value={ numberFilter.value }
            onChange={ handleChange }
          />
        </label>
        <button
          data-testid="button-filter"
          type="button"
          onClick={ handleClick }
        >
          Filtrar
        </button>
      </article>
      <article>
        <h4>Filtros pesquisados:</h4>
        {filterList.map(({ column, comparison, value }, index) => (
          <p key={ index }>{`${column} ${comparison} ${value}`}</p>
        ))}
      </article>
    </section>
  );
}

export default Filters;
