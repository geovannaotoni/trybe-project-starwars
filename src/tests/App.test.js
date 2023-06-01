import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import mockData from './helpers/mockData';
import PlanetsProvider from '../context/planetsProvider';
import userEvent from '@testing-library/user-event';

describe('Testes para o componente Table', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });

    render(
      <PlanetsProvider>
        <App />
      </PlanetsProvider>
    );
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  it('Verifica se o cabeçalho da tabela e os planetas são renderizados corretamente', async () => {
    const headersAPI = Object.keys(mockData.results[0]);
    const headers = await screen.findAllByRole('columnheader');
    headers.forEach((header, index) => {
      expect(header).toHaveTextContent(headersAPI[index]);
    })
  });
})

describe('Testes para o componente Filters', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    });

    render(
      <PlanetsProvider>
        <App />
      </PlanetsProvider>
    );
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  it('Verifica se o filtro por nome funciona corretamente', () => {
    const inputName = screen.getByTestId('name-filter');
    userEvent.type(inputName, 'be');
    const rowsTable = screen.getAllByRole('row');
    // ao escrever 'be' no input, espera-se que a tabela tenha 2 linhas (a linha do header e a linha do planeta Bespin)
    expect(rowsTable.length).toBe(2);
  })

  it('Verifica se o filtro por valores funciona corretamente', () => {
    const selectColumn = screen.getByTestId('column-filter');
    userEvent.selectOptions(selectColumn, 'orbital_period');
    expect(selectColumn.value).toBe('orbital_period');
  
    const selectComparison = screen.getByTestId('comparison-filter');
    userEvent.selectOptions(selectComparison, 'menor que');

    const valueInput = screen.getByTestId('value-filter');
    userEvent.type(valueInput, '350');

    const btnFilter = screen.getByTestId('button-filter');
    userEvent.click(btnFilter);

    // Ao filtrar por 'orbital_period menor que 350', espera-se que a tabela tenha 4 linhas (o header e as três linhas com os planetas Tatooine, Dagobah e Naboo)
    const rowsTableOne = screen.getAllByRole('row');
    expect(rowsTableOne.length).toBe(4);

    // Segundo filtro aplicado 'diameter maior que 10000', espera-se que a tabela tenha 3 linhas (o header e as duas linhas com os planetas Tatooine e Naboo)
    userEvent.selectOptions(selectColumn, 'diameter');
    userEvent.selectOptions(selectComparison, 'maior que');
    userEvent.type(valueInput, '10000');
    userEvent.click(btnFilter);
    const rowsTableTwo = screen.getAllByRole('row');
    expect(rowsTableTwo.length).toBe(3);

    // Terceiro filtro aplicado 'rotation_period igual a 23'
    userEvent.selectOptions(selectColumn, 'rotation_period');
    userEvent.selectOptions(selectComparison, 'igual a');
    userEvent.type(valueInput, '23');
    userEvent.click(btnFilter);
    const rowsTableThree = screen.getAllByRole('row');
    expect(rowsTableThree.length).toBe(2); // duas linhas: o header e o planeta Tatooine
  })

  it('Verifica se ao excluir um filtro, a coluna é adicionada novamente ao dropdown', () => {
    const selectColumn = screen.getByTestId('column-filter');
    const selectComparison = screen.getByTestId('comparison-filter');
    const valueInput = screen.getByTestId('value-filter');
    const btnFilter = screen.getByTestId('button-filter');

    // Adicionando um filtro
    userEvent.selectOptions(selectColumn, 'population');
    userEvent.selectOptions(selectComparison, 'maior que');
    userEvent.type(valueInput, '1000');
    userEvent.click(btnFilter);
    expect(screen.getByText(/population maior que 01000/i)).toBeInTheDocument();

    // Verifica se a opção 'population' não está presente no select de colunas, já que ela já foi selecionada para o filtro anteriormente
    const columnOptions = Array.from(selectColumn.options); // array com todas as options do select de colunas
    columnOptions.forEach((column) => {
      expect(column).not.toHaveTextContent('population')
    })

    // Ao clicar no botão de deletar o filtro, o filtro é deletado
    const btnDelete = screen.getByRole('button', { name: /x/i });
    userEvent.click(btnDelete);
    expect(screen.queryByText(/population maior que 01000/i)).not.toBeInTheDocument();
  })

  it('Verifica se o botão de deletar todos os filtros funciona corretamente', () => {
    const selectColumn = screen.getByTestId('column-filter');
    const selectComparison = screen.getByTestId('comparison-filter');
    const valueInput = screen.getByTestId('value-filter');
    const btnFilter = screen.getByTestId('button-filter');
    
    // filtro 1
    userEvent.selectOptions(selectColumn, 'population');
    userEvent.selectOptions(selectComparison, 'maior que');
    userEvent.type(valueInput, '1000');
    userEvent.click(btnFilter);

    // filtro 2
    userEvent.selectOptions(selectColumn, 'orbital_period');
    userEvent.selectOptions(selectComparison, 'maior que');
    userEvent.type(valueInput, '400');
    userEvent.click(btnFilter);

    const divFilters = screen.getAllByTestId('filter');
    expect(divFilters.length).toBe(2); // uma div para cada filtro

    // verifica se as options não estão mais no dropdown list
    const columnOptions = Array.from(selectColumn.options); // array com todas as options do select de colunas
    columnOptions.forEach((column) => {
      expect(column).not.toHaveTextContent('population');
      expect(column).not.toHaveTextContent('orbital_period');
    })
    expect(screen.getAllByRole('option', { name: 'population' }).length).toBe(1);
    expect(screen.getAllByRole('option', { name: 'orbital_period' }).length).toBe(1);

    // remove todos os filtros
    const btnDeleteAll = screen.getByTestId('button-remove-filters');
    userEvent.click(btnDeleteAll);
    expect(screen.queryAllByTestId('filter')).toHaveLength(0);

    // verifica se as options voltam ao dropdown
    expect(screen.getAllByRole('option', { name: 'population' }).length).toBe(2);
    expect(screen.getAllByRole('option', { name: 'orbital_period' }).length).toBe(2);
  })

  it('Verifica se ao selecionar todos os filtros possíveis, o dropdown de colunas fica sem nenhuma option', () => {
    const btnFilter = screen.getByTestId('button-filter');
    const selectColumn = screen.getByTestId('column-filter');
    // Acessando as options por meio do HTMLCollection para verificar quantas options estão presentes na coleção select.
    expect(selectColumn.options.length).toBe(5); // 5 options para o selectColumn

    for (let index = 0; index < 5; index += 1) {
      userEvent.click(btnFilter);
    }
    expect(selectColumn.options.length).toBe(0);
  })

  it('Verifica se a opção de ordenação ascendente funciona corretamente', () => {
    const selectColumnSort = screen.getByTestId('column-sort');
    const radioSortAsc = screen.getByTestId('column-sort-input-asc');
    const btnSort = screen.getByTestId('column-sort-button');
    
    userEvent.selectOptions(selectColumnSort, 'population');
    userEvent.click(radioSortAsc);
    userEvent.click(btnSort);

    const allPlanetNames = screen.getAllByTestId('planet-name');

    // outra solução para ordenação. Nesse caso, para ordenar de forma crescente:
    const orderedPlanetNames = mockData.results.sort((a, b) => {
      if (a.population === 'unknown') return 1; // se 'a' for unknown, retorna o maior numero possivel (1), para que ele vá para o final
      if (b.population === 'unknown') return -1; // se 'b' for unknown, retorna o menor numero possivel (-1), para que ele vá para o final
      return Number(a.population) - Number(b.population); // se a operação der positivo, o 'a' é menor que o 'b' e é colocado antes
    })

    allPlanetNames.forEach((planetName, index) => {
      expect(planetName).toHaveTextContent(orderedPlanetNames[index].name);
    })
  })

  it('Verifica se a opção de ordenação descendente funciona corretamente', () => {
    const selectColumnSort = screen.getByTestId('column-sort');
    const radioSortDesc = screen.getByTestId('column-sort-input-desc');
    const btnSort = screen.getByTestId('column-sort-button');
    
    userEvent.selectOptions(selectColumnSort, 'population');
    userEvent.click(radioSortDesc);
    userEvent.click(btnSort);

    const allPlanetNames = screen.getAllByTestId('planet-name');

    const orderedPlanetNames = mockData.results.sort((a, b) => {
      if (a.population === 'unknown') return 1;
      if (b.population === 'unknown') return -1;
      return Number(b.population) - Number(a.population);
    })

    allPlanetNames.forEach((planetName, index) => {
      expect(planetName).toHaveTextContent(orderedPlanetNames[index].name);
    })
  })
});
