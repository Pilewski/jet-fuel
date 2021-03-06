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
      urlInput: '',
      selectedFolder: [],
      sortKey: '',
    }
  }

  componentDidMount() {
    axios.get('/folders')
    .then(response => this.setState({ folders: response.data }))
    .catch(error => console.error(error))

    axios.get('/urls')
    .then(response => this.setState({ urls: response.data }))
    .catch(error => console.error(error))
  }

  handleChange(location, param) {
    const userInput = location.target.value;
    const key = param;
    key === 'folderInput' ? this.setState({ folderInput: userInput }) : this.setState({ urlInput: userInput })
  }

  updateSelectedFolder(folder_id, title) {
    this.setState({ selectedFolder: [folder_id, title] })
  }

  addFolder() {
    const folder = this.state.folderInput

    axios.post(('/folders'), { title: folder })
    .then((response) => {
      this.setState({
        folders: response.data,
      })
    })
    .catch(error => console.error(error))

    this.setState({ folderInput: '' })
  }

  addURLToFolder() {
    const folder_id = this.state.selectedFolder[0]
    const url = this.state.urlInput

    if (!/^(?:(ftp|http|https):\/\/)?(?:[\w-]+\.)+[a-z]{3,6}$/.test(url)) {
      alert('Enter a valid URL')
      return
    }

    axios.post((`/urls/${folder_id}`), { url })
    .then((response) => {
      this.setState({
        urls: response.data,
      })
    })

    this.setState({ urlInput: '' })
  }

  displayURLs(location) {
    const id = location.target.id
    const title = location.target.innerHTML
    this.updateSelectedFolder(id, title)
  }

  updateURLState(response) {
    this.setState({ urls: response })
  }

  sortByPopularity() {
    const urls = this.state.urls
    if (this.state.sortKey !== 'popdesc') {
      urls.sort((a, b) => { return b.count - a.count })
      this.setState({ urls, sortKey: 'popdesc' })
    } else {
      urls.sort((a, b) => { return a.count - b.count })
      this.setState({ urls, sortKey: 'popasc' })
    }
  }

  sortByDate() {
    const urls = this.state.urls
    if (this.state.sortKey !== 'datedesc') {
      urls.sort((a, b) => { return b.date - a.date })
      this.setState({ urls, sortKey: 'datedesc' })
    } else {
      urls.sort((a, b) => { return a.date - b.date })
      this.setState({ urls, sortKey: 'dateasc' })
    }
  }

  render() {
    const { folders, urls, folderInput, urlInput, selectedFolder } = this.state

    return (
      <div className="App">
        <header>
          <h1 id="app-title">
            Welcome To <span>Irw.in:</span>
          </h1>
          <p id="tagline">Your favorite URL shortener</p>
        </header>

        <section className="input-container">
          <Input
            id="add-folder-input"
            btnid="add-folder-button"
            folderInput={folderInput}
            placeholder="Enter a folder"
            buttonText="ADD FOLDER"
            handleChange={(e, param) => this.handleChange(e, param)}
            addMethod={() => this.addFolder()}
            param="folderInput"
            selectedFolder={selectedFolder}
          />
          <Input
            id="add-url-input"
            btnid="add-url-button"
            folderInput={urlInput}
            placeholder="www.yoururl.com"
            buttonText="ADD URL"
            handleChange={(e, param) => this.handleChange(e, param)}
            addMethod={() => this.addURLToFolder()}
            param="urlInput"
            selectedFolder={selectedFolder}
          />
        </section>

        <Container
          folders={folders}
          updateFolderState={(folder_id, title) => this.updateSelectedFolder(folder_id, title)}
          urls={urls}
          selectedFolder={selectedFolder}
          displayURLs={e => this.displayURLs(e)}
          updateURLState={response => this.updateURLState(response)}
        />

        {!selectedFolder.length ?
          <div className="sort-container">
            <button
              className="sort-button"
              onClick={() => this.sortByPopularity()}
            >
              Sort by Popularity
            </button> <br />
            <button
              className="sort-button"
              onClick={() => this.sortByDate()}
            >
              Sort by Date Added
            </button>
          </div>
        : ''}
      </div>
    )
  }
}

export default App;
