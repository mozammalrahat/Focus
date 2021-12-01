import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Icon, List } from "semantic-ui-react";
import { logoutUser } from "../../utils/authUser";

function SideMenu({
  user: { unreadNotification, email, unreadMessage, username },
}) {
  const router = useRouter();

  const isActive = (route) => router.pathname === route;
  const pathString = router.pathname.slice(0, 3);

  return (
    <>
      <List
        style={{ paddingTop: "1rem" }}
        size="big"
        verticalAlign="middle"
        selection
      >
        {pathString === "/qa" ? (
          <>
            <Link href="/">
              <List.Item active={isActive("/")}>
                <Icon
                  name="home"
                  size="large"
                  color={isActive("/") && "teal"}
                />
                <List.Content>
                  <List.Header content="Home" />
                </List.Content>
              </List.Item>
            </Link>
            <br />
            <Link href="/qa">
              <List.Item active={isActive("/")}>
                <Icon
                  name="question circle outline"
                  size="large"
                  color="blue"
                />
                <List.Content>
                  <List.Header content="Question" />
                </List.Content>
              </List.Item>
            </Link>
            <br />

            <Link href="/qa/jobpostIndex">
              <List.Item active={isActive("/jobpostIndex")}>
                <Icon name="briefcase" size="large" color="blue" />

                <List.Content>
                  <List.Header content="Job Posts" />
                </List.Content>
              </List.Item>
            </Link>
            <br />

            <Link href="#">
              <List.Item active={isActive("/messages")}>
                <Icon
                  name={unreadMessage ? "hand point right" : "mail outline"}
                  size="large"
                  color={
                    (isActive("/studentshub/messages") && "teal") ||
                    (unreadMessage && "orange")
                  }
                />
                <List.Content>
                  <List.Header content="Messages" />
                </List.Content>
              </List.Item>
            </Link>
            <br />
            <Link href="/qa/notifications">
              <List.Item active={isActive("/notifications")}>
                <Icon
                  name={
                    unreadNotification ? "hand point right" : "bell outline"
                  }
                  size="large"
                  color={
                    (isActive("/notifications") && "teal") ||
                    (unreadNotification && "red")
                  }
                />
                <List.Content>
                  <List.Header content="Notifications" />
                </List.Content>
              </List.Item>
            </Link>
            <br />
            <Link href={`/qa/${username}`}>
              <List.Item active={router.query.username === username}>
                <Icon
                  name="user"
                  size="large"
                  color={router.query.username === username && "teal"}
                />
                <List.Content>
                  <List.Header content="Account" />
                </List.Content>
              </List.Item>
            </Link>
            <br />
          </>
        ) : (
          <>
            <Link href="/">
              <List.Item active={isActive("/")}>
                <Icon
                  name="home"
                  size="large"
                  color={isActive("/") && "teal"}
                />
                <List.Content>
                  <List.Header content="Home" />
                </List.Content>
              </List.Item>
            </Link>
            <br />

            <Link href="/studentshub">
              <List.Item active={isActive("/")}>
                <Icon name="group" size="large" color="blue" />
                <List.Content>
                  <List.Header content="StudentHub" />
                </List.Content>
              </List.Item>
            </Link>
            <br />

            <Link href="#">
              <List.Item active={isActive("/messages")}>
                <Icon
                  name={unreadMessage ? "hand point right" : "mail outline"}
                  size="large"
                  color={
                    (isActive("/studentshub/messages") && "teal") ||
                    (unreadMessage && "orange")
                  }
                />
                <List.Content>
                  <List.Header content="Messages" />
                </List.Content>
              </List.Item>
            </Link>
            <br />
            <Link href="/studentshub/notifications">
              <List.Item active={isActive("/notifications")}>
                <Icon
                  name={
                    unreadNotification ? "hand point right" : "bell outline"
                  }
                  size="large"
                  color={
                    (isActive("/notifications") && "teal") ||
                    (unreadNotification && "red")
                  }
                />
                <List.Content>
                  <List.Header content="Notifications" />
                </List.Content>
              </List.Item>
            </Link>
            <br />
            <Link href={`/studentshub/${username}`}>
              <List.Item active={router.query.username === username}>
                <Icon
                  name="user"
                  size="large"
                  color={router.query.username === username && "teal"}
                />
                <List.Content>
                  <List.Header content="Account" />
                </List.Content>
              </List.Item>
            </Link>
            <br />
          </>
        )}

        <List.Item onClick={() => logoutUser(email)}>
          <Icon name="log out" size="large" />
          <List.Content>
            <List.Header content="Logout" />
          </List.Content>
        </List.Item>
      </List>
    </>
  );
}

export default SideMenu;
