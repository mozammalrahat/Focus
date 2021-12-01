import axios from "axios";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import { NoProfile, NoProfilePosts } from "../../components/Layout/NoData";
import { PlaceHolderPosts } from "../../components/Layout/PlaceHolderGroup";
import { PostDeleteToastr } from "../../components/Layout/Toastr";
import CardPost from "../../components/Post/CardPost";
import Followers from "../../components/Profile/Followers";
import Following from "../../components/Profile/Following";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileMenuTabs from "../../components/Profile/ProfileMenuTabs";
import Settings from "../../components/Profile/Settings";
import UpdateProfile from "../../components/Profile/UpdateProfile";
import baseUrl from "../../utils/baseUrl";

function ProfilePage({
  errorLoading,
  profile,
  followersLength,
  followingLength,
  user,
  userFollowStats,
}) {
  const router = useRouter();
  // const router = useRouter();
  const pathString = router.pathname;
  console.log("Inside Profile page --> pathString", pathString);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showToastr, setShowToastr] = useState(false);

  const [activeItem, setActiveItem] = useState("profile");
  const handleItemClick = (clickedTab) => setActiveItem(clickedTab);

  const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowStats);

  const ownAccount = profile.user._id === user._id;

  if (errorLoading) return <NoProfile />;

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);

      try {
        const { username } = router.query;
        const res = await axios.get(
          `${baseUrl}/api/qa/profile/posts/${username}`, // eikhane ase na /studenthub/useder namee chole jay.
          {
            headers: { Authorization: cookie.get("token") },
          }
        );

        setPosts(res.data);
      } catch (error) {
        alert("Error Loading Posts");
      }

      setLoading(false);
    };
    getPosts();
  }, [router.query.username]);

  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 4000);
  }, [showToastr]);
  // console.log("Post Lists");
  // console.log(posts);

  return (
    <>
      {showToastr && <PostDeleteToastr />}

      <Grid stackable>
        <Grid.Row>
          <Grid.Column>
            <ProfileMenuTabs
              activeItem={activeItem}
              handleItemClick={handleItemClick}
              followersLength={followersLength}
              followingLength={followingLength}
              ownAccount={ownAccount}
              loggedUserFollowStats={loggedUserFollowStats}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            {activeItem === "profile" && (
              <>
                <ProfileHeader
                  profile={profile}
                  ownAccount={ownAccount}
                  loggedUserFollowStats={loggedUserFollowStats}
                  setUserFollowStats={setUserFollowStats}
                />

                {loading ? (
                  <PlaceHolderPosts />
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <CardPost
                      key={post._id}
                      post={post}
                      user={user}
                      setPosts={setPosts}
                      setShowToastr={setShowToastr}
                    />
                  ))
                ) : (
                  <NoProfilePosts />
                )}
              </>
            )}

            {activeItem === "followers" && (
              <Followers
                user={user}
                loggedUserFollowStats={loggedUserFollowStats}
                setUserFollowStats={setUserFollowStats}
                profileUserId={profile.user._id}
              />
            )}

            {activeItem === "following" && (
              <Following
                user={user}
                loggedUserFollowStats={loggedUserFollowStats}
                setUserFollowStats={setUserFollowStats}
                profileUserId={profile.user._id}
              />
            )}

            {activeItem === "updateProfile" && (
              <UpdateProfile Profile={profile} />
            )}

            {activeItem === "settings" && (
              <Settings newMessagePopup={user.newMessagePopup} />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}

ProfilePage.getInitialProps = async (ctx) => {
  try {
    const { username } = ctx.query;
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/qa/profile/${username}`, {
      headers: { Authorization: token },
    });

    const { profile, followersLength, followingLength } = res.data;

    return { profile, followersLength, followingLength };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default ProfilePage;
