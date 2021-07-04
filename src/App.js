import "./styles.css";
import React from "react";
import axios from "axios";
import { Formik, Form, ErrorMessage } from "formik";
//import Alert from "react-bootstrap/Alert";

const API_URL = "https://jsonplaceholder.typicode.com/posts";
const VIEW_URL = "https://jsonplaceholder.typicode.com/comments";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      id: "",
      userId: "",
      title: "",
      body: ""
    };
  }

  componentDidMount() {
    this.getPosts();
  }
  //CREATE
  createPosts = async () => {
    const { userId, title, body } = this.state;
    const { data } = await axios.post(API_URL, {
      userId,
      title,
      body
    });
    //console.log(data);
    let posts = [...this.state.posts];
    posts.push(data);
    this.setState({ posts, userId: "", body: "", title: "" });
  };

  //DELETE
  deletePost = async (postId) => {
    await axios.delete(`${API_URL}/${postId}`);
    let posts = [...this.state.posts];
    posts = posts.filter((post) => post.id !== postId);
    this.setState({ posts });
  };

  //UPDATE
  updatePosts = async () => {
    const { id, userId, title, body } = this.state;
    const { data } = await axios.put(`${API_URL}/${this.state.id}`, {
      userId,
      title,
      body
    });
    const posts = [...this.state.posts];
    const postIndex = posts.findIndex((post) => post.id === id);
    posts[postIndex] = data;
    this.setState({ posts, userId: "", body: "", title: "" });
  };

  //READ
  getPosts = async () => {
    const { data } = await axios.get(API_URL);
    this.setState({ posts: data });
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    });
  };

  // handleSubmit = (evt) => {
  //   evt.preventDefault();
  //   if (this.state.id) {
  //     this.updatePosts();
  //   } else this.createPosts();
  // };

  selectPost = (post) => {
    this.setState({ ...post });
  };

  //viewComments
  //Not able to Console the comments
  viewComments = async (postId) => {
    const { data } = await axios.get(`${VIEW_URL}/${postId}`);
    console.log(data);
    alert(`Email : ${data.email}`);
  };

  render() {
    return (
      <div className="App">
        <h1>BlogPosts</h1>
        <Formik
          initialValues={{
            userId: "",
            title: "",
            body: ""
          }}
          validate={(values) => {
            const errors = {};
            if (!values.userId) {
              errors.userId = "User Id is required";
            }

            if (!values.title) {
              errors.title = "Title is required";
            }

            if (!values.body) {
              errors.body = "Body is required";
            }
            return errors;
          }}
          onSubmit={(values) => {
            if (this.state.id) {
              this.updatePosts();
            }
            this.createPost();
          }}
        >
          {() => {
            return (
              <div className="App">
                <Form>
                  <div>
                    <label>UserId : </label>
                    <input
                      type="text"
                      name="userId"
                      onClick={this.handleChange}
                      value={this.state.userId}
                    />
                    <ErrorMessage name="userId" />
                  </div>

                  <div>
                    <label>Title : </label>
                    <input
                      type="text"
                      name="title"
                      onClick={this.handleChange}
                      value={this.state.title}
                    />
                    <ErrorMessage name="title" />
                  </div>

                  <div>
                    <label>Body : </label>
                    <input
                      type="text"
                      name="body"
                      onClick={this.handleChange}
                      value={this.state.body}
                    />
                    <ErrorMessage name="body" />
                  </div>

                  <div>
                    <button type="submit">Submit</button>
                  </div>
                </Form>
              </div>
            );
          }}
        </Formik>
        {/* <form onSubmit={this.handleSubmit}>
          <div>
            <label>UserId : </label>
            <input
              type="text"
              name="userId"
              value={this.state.userId}
              onChange={this.handleChange}
              required
            />
          </div>
          <div>
            <label>Title : </label>
            <input
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
              required
            />
          </div>
          <div>
            <label>Body : </label>
            <input
              type="text"
              name="body"
              value={this.state.body}
              onChange={this.handleChange}
              required
            />
          </div>
          <div>
            <input type="submit" />
          </div>
        </form> */}
        <table>
          <thead>
            <tr>
              <td>Id</td>
              <td>UserId</td>
              <td>Title</td>
              <td>Body</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map((post) => {
              return (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.userId}</td>
                  <td>{post.title}</td>
                  <td>{post.body}</td>
                  <td>
                    <button
                      onClick={() => {
                        this.selectPost(post);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        this.deletePost(post.id);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        this.viewComments(post.id);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
