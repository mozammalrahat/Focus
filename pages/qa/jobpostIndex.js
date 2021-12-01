import axios from "axios";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Segment } from "semantic-ui-react";
import { NoPosts } from "../../components/Layout/NoData";
import {
  EndMessage,
  PlaceHolderPosts,
} from "../../components/Layout/PlaceHolderGroup";
import { PostDeleteToastr } from "../../components/Layout/Toastr";
import CardPost from "../../components/Post/CardPost";
import CreatePost from "../../components/Post/CreatePost";
import CreatePostQA from "../../components/Post/CreatePostQA";
import baseUrl from "../../utils/baseUrl";

function jobpost({ user, postsData, errorLoading }) {
  const [posts, setPosts] = useState(postsData || []);
  const [showToastr, setShowToastr] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const path = router.pathname;
  const pathString = path.slice(0, 3);

  const [pageNumber, setPageNumber] = useState(2);

  useEffect(() => {
    document.title = `Welcome, ${user.name.split(" ")[0]}`;
  }, []);

  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 3000);
  }, [showToastr]);

  const fetchDataOnScroll = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/qa/posts`, {
        headers: { Authorization: cookie.get("token") },

        params: { pageNumber, toggle: "JobPost" },
      });

      if (res.data.length === 0) setHasMore(false);

      setPosts((prev) => [...prev, ...res.data]);
      setPageNumber((prev) => prev + 1);
      // console.log("Inside--->fetchDataOnScroll");
    } catch (error) {
      alert("Error fetching Posts");
    }
  };
  if (pathString === "/qa") {
    if (posts.length === 0 || errorLoading)
      return (
        <>
          <CreatePostQA user={user} setPosts={setPosts} />
          <NoPosts />
        </>
      );
  } else {
    if (posts.length === 0 || errorLoading)
      return (
        <>
          <CreatePost user={user} setPosts={setPosts} />
          <NoPosts />
        </>
      );
  }

  return (
    <>
      {pathString === "/qa" ? (
        <>
          {showToastr && <PostDeleteToastr />}
          <Segment>
            <CreatePostQA user={user} setPosts={setPosts} />

            <InfiniteScroll
              hasMore={hasMore}
              next={fetchDataOnScroll}
              loader={<PlaceHolderPosts />}
              endMessage={<EndMessage />}
              dataLength={posts.length}
            >
              {posts.map((post) => (
                <CardPost
                  key={post._id}
                  post={post}
                  user={user}
                  setPosts={setPosts}
                  setShowToastr={setShowToastr}
                />
              ))}
            </InfiniteScroll>
          </Segment>
        </>
      ) : (
        <>
          {showToastr && <PostDeleteToastr />}
          <Segment>
            <CreatePost user={user} setPosts={setPosts} />

            <InfiniteScroll
              hasMore={hasMore}
              next={fetchDataOnScroll}
              loader={<PlaceHolderPosts />}
              endMessage={<EndMessage />}
              dataLength={posts.length}
            >
              {posts.map((post) => (
                <CardPost
                  key={post._id}
                  post={post}
                  user={user}
                  setPosts={setPosts}
                  setShowToastr={setShowToastr}
                />
              ))}
            </InfiniteScroll>
          </Segment>
        </>
      )}
    </>
  );
}

jobpost.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/qa/posts`, {
      headers: { Authorization: token },
      params: { pageNumber: 1, toggle: "JobPost" },
    });
    // console.log(res.data);
    return { postsData: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default jobpost;
