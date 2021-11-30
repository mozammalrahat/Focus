import axios from "axios";
import Link from "next/link";
import { parseCookies } from "nookies";
import React, { useState } from "react";
import {
  Card,
  Container,
  Divider,
  Icon,
  Image,
  Segment,
} from "semantic-ui-react";
import { NoPostFound } from "../../../components/Layout/NoData";
import CommentInputField from "../../../components/Post/CommentInputField";
import LikesList from "../../../components/Post/LikesList";
import PostComments from "../../../components/Post/PostComments";
import baseUrl from "../../../utils/baseUrl";
import calculateTime from "../../../utils/calculateTime";

function PostPage({ post, errorLoading, user }) {
  if (errorLoading) {
    return <NoPostFound />;
  }

  // console.log("@@post.qa_toggle------->", post.qa_toggle);

  const [votes, setVotes] = useState(post.votes);

  const isVoted =
    votes.length > 0 &&
    votes.filter((vote) => vote.user === user._id).length > 0;

  const [answers, setAnswers] = useState(post.answers);

  return (
    <Container text>
      <Segment basic>
        <Card color="teal" fluid>
          {post.picUrl && (
            <Image
              src={post.picUrl}
              style={{ cursor: "pointer" }}
              floated="left"
              wrapped
              ui={false}
              alt="PostImage"
              onClick={() => setShowModal(true)}
            />
          )}

          <Card.Content>
            <Image
              floated="left"
              src={post.user.profilePicUrl}
              avatar
              circular
            />
            <Card.Header>
              <Link href={`/${post.user.username}`}>
                <a>{post.user.name}</a>
              </Link>
            </Card.Header>

            <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>

            {post.topic && <Card.Meta content={post.topic} />}

            <Card.Description
              style={{
                fontSize: "17px",
                letterSpacing: "0.1px",
                wordSpacing: "0.35px",
              }}
            >
              {post.text}
            </Card.Description>
          </Card.Content>

          <Card.Content extra>
            <Icon
              name={isVoted ? "heart" : "heart outline"}
              color="red"
              style={{ cursor: "pointer" }}
              // onClick={() =>
              //   likePost(post._id, user._id, setVotes, isVoted ? false : true)
              // }
            />

            <LikesList
              postId={post._id}
              trigger={
                votes.length > 0 && (
                  <span className="spanLikesList">
                    {`${votes.length} ${votes.length === 1 ? "like" : "likes"}`}
                  </span>
                )
              }
            />

            <Icon
              name="comment outline"
              style={{ marginLeft: "7px" }}
              color="blue"
            />

            {answers.length > 0 &&
              answers.map((comment) => (
                <PostComments
                  key={comment._id}
                  comment={comment}
                  postId={post._id}
                  user={user}
                  setComments={setAnswers}
                />
              ))}

            <Divider hidden />

            <CommentInputField
              user={user}
              postId={post._id}
              setComments={setAnswers}
            />
          </Card.Content>
        </Card>
      </Segment>
      <Divider hidden />
    </Container>
  );
}

PostPage.getInitialProps = async (ctx) => {
  try {
    const { postId } = ctx.query;
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/qa/posts/${postId}`, {
      headers: { Authorization: token },
    });

    return { post: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default PostPage;
