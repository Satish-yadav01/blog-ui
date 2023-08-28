import { useParams } from "react-router-dom";
import Loader from "components/Loader/Loader";
import PostPreview from "components/PostPreview/PostPreview";
import Tabs from "components/Tabs/Tabs";
import { useAxiosGet } from "hooks/useAxiosGet";
import "./Profile.scss";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  // const { id } = useParams();
  // const { data: user, error } = useAxiosGet(`/user/${id}`);
  // const [profileImage, setprofileImage] = useState(null);
  // const [error, setError] = useState("");
  // const [user, setUser] = useState(null);
  const { id } = useParams();
  const { data: user, error } = useAxiosGet(`/user/${id}`);
  // console.log("user--------:" + JSON.stringify(user));
  const [profileImage, setprofileImage] = useState(null);

  useEffect(() => {

    // console.log("user : " + user);
    // console.log("user.profileImagePath " + user.profileImagePath)
    if (user && user.profileImagePath != null) {
      axios.get(`/images/user/${user.profileImagePath}`, { responseType: 'arraybuffer' })
        .then(response => {
          // Convert the image data to a base64-encoded string
          const base64Image = btoa(
            new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          setprofileImage(`data:image/jpeg;base64,${base64Image}`);
        })
        .catch(error => {
          console.error('Error fetching image:', error);
          setError(error);
        });
    }
  }, [user])

  let content;
  if (error) {
    content = <div className="error-msg">{error}</div>;
  } else if (user) {
    // api will send private posts only when the logged in user vists their profile
    const published = [];
    const unpublished = [];
    const drafts = [];

    user.posts.forEach((post) => {
      if (post.status === "pub") {
        published.push(post);
      } else if (post.status === "pvt") {
        unpublished.push(post);
      } else if (post.status === "draft") {
        drafts.push(post);
      }
    });

    let tabs = [
      {
        name: "Published",
        content: (
          <div className="user__posts">
            {published.length === 0 && <div style={{ textAlign: "center" }}>nothing here</div>}
            {published.map((post) => (
              <PostPreview post={post} key={post.id} />
            ))}
          </div>
        ),
      },
    ];

    if (unpublished.length > 0) {
      tabs.push({
        name: "Unpublished",
        content: (
          <div className="user__posts">
            {unpublished.map((post) => (
              <PostPreview post={post} key={post.id} />
            ))}
          </div>
        ),
      });
    }

    if (drafts.length > 0) {
      tabs.push({
        name: "Drafts",
        content: (
          <div className="user__posts">
            {drafts.map((post) => (
              <PostPreview post={post} key={post.id} />
            ))}
          </div>
        ),
      });
    }

    content = (
      <div className="user">
        <div className="user__info">
          <img src={profileImage} alt="Avatar" className="avatar user__avatar" />
          <h2 className="user__name">{user.name}</h2>
          <span>{user.posts.length} posts</span>
        </div>
        <Tabs tabs={tabs} centered />
      </div>
    );
  } else {
    content = <Loader />;
  }

  return (
    <div className="page" id="profile-page">
      {content}
    </div>
  );
}
