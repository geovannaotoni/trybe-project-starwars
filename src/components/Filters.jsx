import React, { useContext, useEffect, useState } from 'react';
import PlanetsContext from '../context/planetsContext';

function Filters() {
  const {
    setNameFilter,
    setFilterList, // função que seta o array de filtros (é um array de objetos em que cada objeto é um filtro)
    filterList,
    setSortPlanets,
  } = useContext(PlanetsContext);

  // cria um state local com a dropdown list para o select de colunas
  const initialColumns = [
    'population', 'orbital_period', 'diameter', 'rotation_period', 'surface_water',
  ];
  const [columns, setColumns] = useState(initialColumns);

  // constante com a dropdown list para o select de comparação
  const comparisons = ['maior que', 'igual a', 'menor que'];

  // cria um state local que é um objeto contendo os valores dos filtros de coluna, comparação e valor
  const [numberFilter, setNumberFilter] = useState({
    column: columns[0],
    comparison: 'maior que',
    value: 0,
  });

  // cria um state local que é um objeto que armazena a coluna selecionada e o tipo de ordenação
  const [sortFilter, setSortFilter] = useState({
    column: 'population',
    sort: 'ASC',
  });

  // ao digitar no input, altera-se o valor do state local numberFilter, sem perder os demais dados desse state (utlizando o ...prevNumberFilter)
  const handleChange = ({ target: { name, value } }) => {
    setNumberFilter((prevNumberFilter) => ({
      ...prevNumberFilter,
      [name]: value,
    }));
  };

  // ao clicar no botão de filtrar:
  const handleClickFilter = () => {
    // console.log(numberFilter);
    // filtra as colunas removendo a coluna já selecionada da lista, depois seta a nova lista no state local
    const newColumns = columns.filter((col) => col !== numberFilter.column);
    // console.log(newColumns);
    setColumns(newColumns);

    // seta no array FilterList o objeto contendo os dados de coluna, comparação e valor
    setFilterList((prevFilter) => ([
      ...prevFilter,
      numberFilter,
    ]));
  };

  // utiliza-se a useEffect para que, sempre que o estado columns for atualizado, o valor inicial do filtro de número será atualizado para o primeiro elemento do array atualizado columns, o comparison volta a ser o primeiro dropdown e o value volta a ser 0.
  useEffect(() => {
    setNumberFilter({
      column: columns[0] || '', // sempre será o primeiro elemento do array ou uma string vazia se o array não tiver nenhum elemento
      comparison: 'maior que',
      value: 0,
    });
  }, [columns]);

  // remove o filtro da coluna especificada e insere ela novamente no dropdown
  const handleClickDelete = (column) => {
    const newFilterList = filterList.filter((filter) => filter.column !== column);
    setFilterList(newFilterList);
    setColumns([...columns, column]);
  };

  // deleta todos os filtros e seta novamente todas as colunas no dropdown
  const handleClickDeleteAll = () => {
    setColumns(initialColumns);
    setFilterList([]);
  };

  // ao alterar o input radio ou o dropdown de coluna para ordenação, ele altera no state local
  const handleChangeSort = ({ target: { name, value } }) => {
    setSortFilter((prevSortFilter) => ({
      ...prevSortFilter,
      [name]: value,
    }));
  };

  return (
    <section>
      <article className="name-filter-container">
        <input
          className="name-filter"
          type="text"
          data-testid="name-filter"
          placeholder="Filtre por Nome"
          onChange={ ({ target }) => setNameFilter(target.value) }
        />
      </article>
      <article className="column-filter-container">
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
          onClick={ handleClickFilter }
          disabled={ columns.length === 0 }
        >
          Filtrar
        </button>
        <button
          type="button"
          data-testid="button-remove-filters"
          onClick={ handleClickDeleteAll }
        >
          Remover Filtros
        </button>
      </article>
      <article className="filter-list-container">
        <h4>Filtros pesquisados:</h4>
        {filterList.map(({ column, comparison, value }, index) => (
          <div
            key={ index }
            data-testid="filter"
            className="filter-list"
          >
            <p>
              {`${column} ${comparison} ${value}`}
            </p>
            <button
              type="button"
              onClick={ () => handleClickDelete(column) }
            >
              X
            </button>
          </div>
        ))}
      </article>
      <article className="sort-filter-container">
        <label htmlFor="column-sort">
          Ordenar
          <select
            name="column"
            id="column-sort"
            data-testid="column-sort"
            onChange={ handleChangeSort }
          >
            {initialColumns.map((col) => (
              <option value={ col } key={ col }>
                {col}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="column-sort-input-asc">
          <input
            type="radio"
            name="sort"
            value="ASC"
            id="column-sort-input-asc"
            data-testid="column-sort-input-asc"
            onChange={ handleChangeSort }
          />
          Ascendente
        </label>
        <label htmlFor="column-sort-input-desc">
          <input
            type="radio"
            name="sort"
            value="DESC"
            id="column-sort-input-desc"
            data-testid="column-sort-input-desc"
            onChange={ handleChangeSort }
          />
          Descendente
        </label>
        <button
          type="button"
          data-testid="column-sort-button"
          onClick={ () => setSortPlanets(sortFilter) }
        >
          Ordenar
        </button>
      </article>
    </section>
  );
}

export default Filters;
