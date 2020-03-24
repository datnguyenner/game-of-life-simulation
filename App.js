import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      currentGen: createGrid(20, 20),
      setIntervalId: null
    }
  }

  startGameOfLife = () => {
    let setIntervalId = setInterval(this.setNewGen, 200);
    this.setState({ setIntervalId });
  }

  endGameOfLife = () => {
    clearInterval(this.state.setIntervalId);
    this.setState({ currentGen: createGrid(20, 20) });
  }

  setNewGen = () => {
    let prevGen = this.state.currentGen;
    let newGen = getNextGeneration(prevGen);
    this.setState({ currentGen: newGen });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          {renderBoard(this.state.currentGen)}
        </View>
        <TouchableOpacity onPress={this.startGameOfLife}>
          <Text>Start Game of Life</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.endGameOfLife}>
          <Text>End game of life and start a new Generation</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const cell = (alive) => {

  return (
    <View style={[styles.square, { backgroundColor: alive === 1 ? '#000000' : '#fff' }]} />
  );

}

const renderBoard = (grid) => {

  const rows = grid.map((row, rowIndex) => {
    return (
      <View key={rowIndex} style={styles.row}>
        {renderColumns(row, rowIndex)}
      </View>)
  });

  return rows;
}

renderColumns = (row, rowIndex) => {

  const columns = row.map((col, colIndex) => {
    return (
      <View key={colIndex}>
        {cell(col)}
      </View>
    );
  })

  return columns;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  square: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    width: 15,
    height: 15,
    borderColor: '#808080'
  },
  row: {
    flexDirection: 'row',
  },
});

const createGrid = (row, col) => {
  let x = 0;
  const grid = [];
  while (x++ < row) {

    const row = [];
    let y = 0;
    while (y++ < col) {
      row.push(Math.floor(Math.random() * 2));
    }

    grid.push(row);
  }

  return grid;
}

const getNextGeneration = (prevGen) => {

  let x = 0, row = prevGen.length, col = prevGen[0].length;
  const newGen = [];
  while (x < row) {

    const row = [];
    let y = 0;
    while (y < col) {
      let alive = prevGen[x][y];
      let liveNeighbors = countLiveNeighbors(prevGen, x, y);
      if (alive && (liveNeighbors === 2 || liveNeighbors === 3)) {
        row.push(1);
      } else if (!alive && liveNeighbors === 3) {
        row.push(1);
      } else {
        row.push(0);
      }
      y++;
    }

    newGen.push(row);
    x++;
  }

  return newGen;
}

const countLiveNeighbors = (prevGen, x, y) => {

  let sum = 0, row = prevGen.length, col = prevGen[0].length;

  dirs.forEach(dir => {
    let newX = dir[0] + x;
    let newY = dir[1] + y;
      
    if(newX < 0){
      newX = col - 1;
    }else if(newX >= col){
      newX = 0;
    }

    if(newY < 0){
      newY = row - 1;
    }else if(newY >= row){
      newY = 0;
    }

    sum += prevGen[newX][newY];
  });

  return sum;

}

const dirs = [
  [1, -1],
  [1, 0],
  [1, 1],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
];