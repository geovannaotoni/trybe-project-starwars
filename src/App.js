import React from 'react';
import './App.css';
import Table from './components/Table';
import Filters from './components/Filters';
import './style/style.css';

function App() {
  return (
    <>
      <header><h1>StarWars Planets</h1></header>
      <main>
        <Filters />
        <Table />
      </main>
    </>
  );
}

export default App;
