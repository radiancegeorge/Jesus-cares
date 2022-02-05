import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "../../App.css";
import sendData from "./sendData";
import Loader2 from "../../components/Loader";

const Edit = () => {
  const data = JSON.parse(sessionStorage.getItem("edit"));
  const { type, id } = data;
  const [content, setContent] = useState(data.content);
  const [header, setHeader] = useState(data.heading);

  const [loader, setLoader] = useState();
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="post">
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();

          if (content.trim() !== "" && header.trim() !== "") {
            setDisabled(true);
            setLoader(Loader2);
            const data = new FormData();
            data.append("content", content);
            data.append("header", header);
            data.append("type", type);
            data.append("id", id);
            sendData(data)
              .then((response) => {
                if (response.status === 200) {
                  setContent("");
                  setHeader("");
                  setDisabled(false);
                  setTimeout(() => {
                    window.location.href = "/#/blog_post";
                  }, 1000);
                }
              })
              .catch((err) => {
                setLoader();
              });
          }
        }}>
        <input
          defaultValue={header}
          type="text"
          name="header"
          className="header"
          placeholder="Your Heading..."
          onChange={(e) => {
            setHeader(e.target.value);
          }}
        />
        <Editor
          id="editor"
          initialValue={content}
          apiKey="cyzxz48qlxcjtrlm33fqjx8ndfaxsiptkyr7f39owox4hu5h"
          init={{
            height: 300,
            width: "100%",
            menubar: false,
          }}
          onChange={(e) => {
            setContent(e.target.getContent());
          }}
          onClick={(e) => {
            console.log("clicked");
          }}
        />
        <button disabled={disabled} type="submit">
          Update
        </button>
      </form>
      {/* <img src={image !== undefined && image} alt=""/> */}
      {loader !== undefined ? (
        <div className="loader2">{loader}</div>
      ) : undefined}
    </div>
  );
};

export default Edit;
