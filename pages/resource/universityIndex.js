import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Image } from "semantic-ui-react";
import io from "socket.io-client";
import MessageNotificationModal from "../../components/Home/MessageNotificationModal";
import { NoPosts } from "../../components/Layout/NoData";
import baseUrl from "../../utils/baseUrl";
import getUserInfo from "../../utils/getUserInfo";
import newMsgSound from "../../utils/newMsgSound";

function universityIndex({ user, univarsityData, uniList, errorLoading }) {
  const [posts, setPosts] = useState(univarsityData || []);
  const [showToastr, setShowToastr] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [univarsityList, setUnivarsityList] = useState(uniList || []);
  const [studentList, setStudentList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // const [pageNumber, setPageNumber] = useState(2);
  const router = useRouter();
  const pathString = router.pathname;

  const socket = useRef();

  const [newMessageReceived, setNewMessageReceived] = useState(null);
  const [newMessageModal, showNewMessageModal] = useState(false);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }

    if (socket.current) {
      socket.current.emit("join", { userId: user._id });

      socket.current.on("newMsgReceived", async ({ newMsg }) => {
        const { name, profilePicUrl } = await getUserInfo(newMsg.sender);

        if (user.newMessagePopup) {
          setNewMessageReceived({
            ...newMsg,
            senderName: name,
            senderProfilePic: profilePicUrl,
          });
          showNewMessageModal(true);
          newMsgSound(name);
        }
      });
    }

    document.title = `Welcome, ${user.name.split(" ")[0]}`;

    return () => {
      if (socket.current) {
        socket.current.emit("disconnect");
        socket.current.off();
      }
    };
  }, []);

  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 3000);
  }, [showToastr]);

  Object.keys(univarsityList).map(function (key) {
    {
      univarsityList[key].map((item) => {
        // console.log("item-->", typeof item.name);
      });
    }
  });
  const handleClick = (e, { value }) => {
    var myArray = [];
    e.preventDefault();
    univarsityList[value].map((item) => {
      myArray.push({
        name: item.name,
        pic: item.profilePicUrl,
      });
    });

    setStudentList(myArray);
  };

  if (posts.length === 0 || errorLoading)
    return (
      <>
        {newMessageModal && newMessageReceived !== null && (
          <MessageNotificationModal
            socket={socket}
            showNewMessageModal={showNewMessageModal}
            newMessageModal={newMessageModal}
            newMessageReceived={newMessageReceived}
            user={user}
          />
        )}

        <NoPosts />
      </>
    );

  return (
    <>
      {newMessageModal && newMessageReceived !== null && (
        <MessageNotificationModal
          socket={socket}
          showNewMessageModal={showNewMessageModal}
          newMessageModal={newMessageModal}
          newMessageReceived={newMessageReceived}
          user={user}
        />
      )}

      <Card
        fluid
        style={{
          borderColor: "black",
          borderStyle: "solid",
          borderWidth: "1px",
          marginTop: "10px",
        }}
      >
        {Object.keys(univarsityList).map(function (key) {
          return [
            <Card.Content>
              <Card.Header
                style={{
                  borderColor: "black",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  margin: "-5px",
                  height: "65px",
                  backgroundColor: "#e3f9ff",
                }}
              >
                <div
                  style={{
                    marginTop: "20px",
                    marginLeft: "10px",
                    fontSize: "20px",
                  }}
                >
                  {key}
                </div>
              </Card.Header>
            </Card.Content>,
            univarsityList[key].length > 0 &&
              univarsityList[key].map(function (item, i) {
                return [
                  <Card.Content>
                    <Card.Header>
                      <Image
                        floated="left"
                        avatar
                        src={item.profilePicUrl}
                        size="huge"
                      />

                      <Link href={`/qa/${item.username}`}>
                        <a>{item.name}</a>
                      </Link>
                    </Card.Header>
                    <Card.Meta
                      style={{
                        fontSize: "20px",
                        color: "black",
                        fontFamily: "-webkit-body",
                      }}
                    >
                      {item.email}
                    </Card.Meta>
                  </Card.Content>,
                ];
              }),
            univarsityList[key].length > 3 && (
              <Button
                content="View More"
                color="teal"
                basic
                circular
                onClick={() => setShowModal(true)}
              />
            ),
          ];
        })}
      </Card>
    </>
  );
}

universityIndex.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/univarsity`, {
      headers: { Authorization: token },
    });
    const test = Object.keys(res.data);
    // console.log("test-->", test);

    return {
      univarsityData: res.data,
      uniList: res.data,
    };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default universityIndex;
