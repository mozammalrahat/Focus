import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Icon, List } from "semantic-ui-react";
import { logoutUser } from "../../utils/authUser";

function SideMenu({
  user: { unreadNotification, email, unreadMessage, username },
  pc = true,
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
                  color={isActive("/") && "blue"}
                />
                <List.Content>
                  {pc && <List.Header content="Home" />}
                </List.Content>
              </List.Item>
            </Link>
            <br />
            <Link href="/qa">
              <List.Item active={isActive("/qa")}>
                <Icon
                  name="question circle outline"
                  size="large"
                  color={isActive("/qa") && "blue"}
                />
                <List.Content>
                  {pc && <List.Header content="Question" />}
                </List.Content>
              </List.Item>
            </Link>
            <br />

            <Link href="/qa/jobpostIndex">
              <List.Item active={isActive("/jobpostIndex")}>
                <Icon
                  name="briefcase"
                  size="large"
                  color={isActive("/qa/jobpostIndex") && "blue"}
                />

                <List.Content>
                  {pc && <List.Header content="Job Posts" />}
                </List.Content>
              </List.Item>
            </Link>
            {/* <br /> */}

            {/* <Link href="/messages">
              <List.Item active={isActive("/messages")}>
                <Icon
                  name={unreadMessage ? "hand point right" : "mail outline"}
                  size="large"
                  color={
                    (isActive("/studentshub/messages") && "blue") ||
                    (unreadMessage && "orange")
                  }
                />
                <List.Content>
                  {pc && <List.Header content="Messages" />}
                </List.Content>
              </List.Item>
            </Link> */}
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
                  {pc && <List.Header content="Notifications" />}
                </List.Content>
              </List.Item>
            </Link>
            <br />
            <Link href={`/qa/${username}`}>
              <List.Item active={router.query.username === username}>
                <Icon
                  name="user"
                  size="large"
                  color={isActive(`/qa/${username}`) && "blue"}
                />
                <List.Content>
                  {pc && <List.Header content="Account" />}
                </List.Content>
              </List.Item>
            </Link>
            <br />
          </>
        ) : pathString === "/st" ? (
          <>
            <Link href="/">
              <List.Item active={isActive("/")}>
                <Icon
                  name="home"
                  size="large"
                  color={isActive("/") && "blue"}
                />
                <List.Content>
                  {pc && <List.Header content="Home" />}
                </List.Content>
              </List.Item>
            </Link>
            <br />

            <Link href="/studentshub">
              <List.Item active={isActive("/")}>
                <Icon
                  name="group"
                  size="large"
                  color={isActive("/studentshub") && "blue"}
                />
                <List.Content>
                  {pc && <List.Header content="StudentHub" />}
                </List.Content>
              </List.Item>
            </Link>
            <br />

            <Link href="/messages">
              <List.Item active={isActive("/messages")}>
                <Icon
                  name={unreadMessage ? "hand point right" : "mail outline"}
                  size="large"
                  color={
                    (isActive("/studentshub/messages") && "blue") ||
                    (unreadMessage && "orange")
                  }
                />
                <List.Content>
                  {pc && <List.Header content="Messages" />}
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
                  {pc && <List.Header content="Notifications" />}
                </List.Content>
              </List.Item>
            </Link>
            <br />
            <Link href={`/studentshub/${username}`}>
              <List.Item active={router.query.username === username}>
                <Icon
                  name="user"
                  size="large"
                  color={router.query.username === username && "blue"}
                />
                <List.Content>
                  {pc && <List.Header content="Account" />}
                </List.Content>
              </List.Item>
            </Link>
            <br />
          </>
        ) : pathString === "/me" ? (
          <>
            <Link href="/">
              <List.Item active={isActive("/")}>
                <Icon
                  name="home"
                  size="large"
                  color={isActive("/") && "blue"}
                />
                <List.Content>
                  {pc && <List.Header content="Home" />}
                </List.Content>
              </List.Item>
            </Link>
            <br />

            <Link href="/resource">
              <List.Item active={isActive("/")}>
                <Icon
                  name="graduation cap"
                  size="large"
                  color={isActive("/resource") && "blue"}
                />
                <List.Content>
                  {pc && <List.Header content="Higher Study & Resources" />}
                </List.Content>
              </List.Item>
            </Link>
            <br />

            <Link href="/studentshub">
              <List.Item active={isActive("/studentshub")}>
                <Icon
                  name="newspaper outline"
                  size="large"
                  color={isActive("/studentshub") && "blue"}
                />
                <List.Content>
                  {pc && <List.Header content="Students Hub" />}
                </List.Content>
              </List.Item>
            </Link>
            <br />
            <Link href="/qa">
              <List.Item active={isActive("/qa")}>
                <Icon
                  name="question circle outline"
                  size="large"
                  color={
                    (isActive("/qa") && "blue") || (unreadNotification && "red")
                  }
                />
                <List.Content>
                  {pc && <List.Header content="Job Resources & QA Section" />}
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
                  color={isActive("/") && "blue"}
                />
                <List.Content>
                  {pc && <List.Header content="Home" />}
                </List.Content>
              </List.Item>
            </Link>
            <br />

            <Link href="/resource">
              <List.Item active={isActive("/")}>
                <Icon
                  name="graduation cap"
                  size="large"
                  color={isActive("/resource") && "blue"}
                />
                <List.Content>
                  {pc && <List.Header content="Scholarships" />}
                </List.Content>
              </List.Item>
            </Link>
            <br />

            <Link href="/resource/files">
              <List.Item active={isActive("/")}>
                <Icon
                  name="newspaper outline"
                  size="large"
                  color={isActive("/resource/files") && "blue"}
                />
                <List.Content>
                  {pc && <List.Header content="ResourceHub" />}
                </List.Content>
              </List.Item>
            </Link>
            <br />
            <Link href="/resource/universityIndex">
              <List.Item active={isActive("/")}>
                <Icon
                  name="university"
                  size="large"
                  color={isActive("/resource/universityIndex") && "blue"}
                />
                <List.Content>
                  {pc && <List.Header content="Universities" />}
                </List.Content>
              </List.Item>
            </Link>
            {/* <br />
            <Link href="/messages">
              <List.Item active={isActive("/messages")}>
                <Icon
                  name={unreadMessage ? "hand point right" : "mail outline"}
                  size="large"
                  color={
                    (isActive("/studentshub/messages") && "blue") ||
                    (unreadMessage && "orange")
                  }
                />
                <List.Content>
                  {pc && <List.Header content="Messages" />}
                </List.Content>
              </List.Item>
            </Link> */}
            <br />
            <Link href="/studentshub/notifications">
              <List.Item active={isActive("/notifications")}>
                <Icon
                  name={
                    unreadNotification ? "hand point right" : "bell outline"
                  }
                  size="large"
                  color={
                    (isActive("/notifications") && "blue") ||
                    (unreadNotification && "red")
                  }
                />
                <List.Content>
                  {pc && <List.Header content="Notifications" />}
                </List.Content>
              </List.Item>
            </Link>
            <br />
            <Link href={`/studentshub/${username}`}>
              <List.Item active={router.query.username === username}>
                <Icon
                  name="user"
                  size="large"
                  color={router.query.username === username && "blue"}
                />
                <List.Content>
                  {pc && <List.Header content="Account" />}
                </List.Content>
              </List.Item>
            </Link>
            <br />
          </>
        )}

        <List.Item onClick={() => logoutUser(email)}>
          <Icon name="log out" size="large" />
          <List.Content>{pc && <List.Header content="Logout" />}</List.Content>
        </List.Item>
      </List>
    </>
  );
}

export default SideMenu;
