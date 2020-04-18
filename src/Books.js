import React, {Component} from 'react';
import SearchArea from './SearchArea';
import request from 'superagent';
import BookList from './BookList'


class Books extends Component {
  constructor(props){
    super(props);
    this.state = {
      books:[],
      searchField:'',
      sort:''
    }
  }

    searchBook = (e) => {
      e.preventDefault();
      request
          .get("https://www.googleapis.com/books/v1/volumes")
          .query({ q: this.state.searchField})
          .then( (data)=> {
            console.log(data);
            const cleanData = this.cleanData(data)
            this.setState({ books: cleanData})
          })
    }


    handleSearch = (event) => {
      console.log(event.target.value);
      this.setState({ searchField:event.target.value })
    }

    handleSort = (event) => {
      console.log(event.target.value);
      this.setState({sort: event.target.value  })
    }

    cleanData = (data) => {
      const cleanData = data.body.items.map((book) => {
        if (book.volumeInfo.hasOwnProperty('publishedDate') === false) {
          book.volumeInfo['publishedDate'] = '0000';
        }
        else if (book.volumeInfo.hasOwnProperty('imageLinks') === false){
           book.volumeInfo['imageLinks'] = { thumbnail:'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg' }
        }
        return book;
      });
      return cleanData;
    };



    render(){
      const sortedBooks = this.state.books.sort((a,b) => {
        if ( this.state.sort === "Newest") {
          return parseInt(b.volumeInfo.publishedDate.substring(0,4)) - parseInt(a.volumeInfo.publishedDate.substring(0,4))
        }
        else if ( this.state.sort === "Oldest") {
          return parseInt(a.volumeInfo.publishedDate.substring(0,4)) - parseInt(b.volumeInfo.publishedDate.substring(0,4))
        }

      })
      return(
        <div>
          <SearchArea searchBook={this.searchBook} handleSearch={this.handleSearch}
          handleSort={this.handleSort} />
        <BookList books={sortedBooks} />

        </div>
      );
    }
}

export default Books;
