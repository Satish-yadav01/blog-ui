import moment from "moment";
import { Link } from "react-router-dom";
import "./PostPreview.scss";
import logo from '../../public/avatar2.png'

export default function PostPreview({ post }) {
  const doc = new DOMParser().parseFromString(post.body, "text/html");
  // console.log("document: " + doc)
  // console.log("post: ")
  // console.log(post);
  return (
    <div className="post-preview">
      {post.id && (
        <div className="post-preview__author">
          <Link to={`/users/${post.id}`}>
            {post.avatarUrl ?
              (<img src={post.avatarUrl} alt="Avatar" className="avatar" />) :
              (<img src={logo} alt="Avatar" className="avatar" />)}

          </Link>
          <div>
            <Link to={`/users/${post.id}`}>{post.title}</Link>
            <br />
            <small>Posted {moment(post.createdAt).fromNow()}</small>
          </div>
        </div>
      )}

      {post.coverUrl && <img src={post.coverUrl} alt="Thumbnail" className="post-preview__image" />}
      <h2 className="post-preview__title">
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h2>
      <p className="post-preview__body">{post.description}</p>
      <div className="post-preview__actions"></div>
    </div>
  );
}

