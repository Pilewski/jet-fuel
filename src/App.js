/* eslint import/no-webpack-loader-syntax: 0 */
import React, { Component } from 'react';
import axios from 'axios'
import './styles/Reset.css'
import './styles/App.css'
import Input from './components/Input'
import Container from './components/Container'

class App extends Component {
  constructor() {
    super()
    this.state = {
      folders: [],
      urls: [],
      folderInput: '',
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3001/folders')
    .then(response => this.setState({ folders: response.data }))
    .catch(error => console.error(error))

    axios.get('http://localhost:3001/urls')
    .then(response => this.setState({ urls: response.data }))
    .catch(error => console.error(error))
  }

  handleChange(location) {
    const userInput = location.target.value;
    this.setState({ folderInput: userInput })
  }

  addFolder() {
    const folder = this.state.folderInput

    axios.post(('http://localhost:3001/folders'), { title: folder })
    .then((response) => {
      this.state.folders.push(response.data)
      this.setState({
        folders: this.state.folders,
      })
    })
    .catch(error => console.error(error))

    this.setState({ folderInput: '' })
  }

  render() {
    const { folders, urls, folderInput } = this.state
    return (
      <div className="App">
        <h1 id='app-title'>
          WELCOME TO <span id='cursive'>IRWIN</span> :<br/> YOUR FAVORITE URL SHORTENER
        </h1>

        <section>
          <Input
            id='add-folder-input'
            folderInput={folderInput}
            handleChange={event => this.handleChange(event)}
            placeholder='Enter a folder'
          />
          <button
            id='add-folder-button'
            onClick={() => this.addFolder()}
          >
            ADD <br/>FOLDER
          </button>
          <Input
            id='add-url-input'
            placeholder='Enter a URL'
          />
          <button id='add-url-button'>ADD <br/>URL</button>
        </section>

        <Container
          folders={folders}
          urls={urls}
        />
      </div>
    );
  }
}

export default App;
