import React from "react";
import { Modal, Grid, Image, Card, Icon, Divider } from "semantic-ui-react";
import PostComments from "./PostComments";
import CommentInputField from "./CommentInputField";
import calculateTime from "../../utils/calculateTime";
import Link from "next/link";
import { likePost } from "../../utils/postActions";
import LikesList from "./LikesList";

function ImageModal({ post, university, setPosts }) {
  return (
    <>
      <Grid columns={2} stackable relaxed>
        <Grid.Column>
          <Card fluid>
            <Card.Content extra>
              <Divider hidden />

              <div
                style={{
                  overflow: "auto",
                  height: post.length > 2 ? "200px" : "60px",
                  marginBottom: "8px",
                }}
              >
                {post.length > 0 &&
                  post.map((post) => (
                    <Postpost
                      key={post._id}
                      post={post}
                      postId={post._id}
                      user={user}
                      setpost={setPosts}
                    />
                  ))}
              </div>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </>
  );
}

export default ImageModal;
