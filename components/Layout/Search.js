import axios from "axios";
import cookie from "js-cookie";
import Router, { useRouter } from "next/router";
import React, { useState } from "react";
import { Image, List, Search } from "semantic-ui-react";
import baseUrl from "../../utils/baseUrl";
let cancel;

function SearchComponent() {
  const router = useRouter();
  const pathString = router.pathname.slice(0, 3);
  // console.log("pathString-->", pathString);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const { value } = e.target;
    setText(value);
    setLoading(true);

    try {
      cancel && cancel();
      const CancelToken = axios.CancelToken;
      const token = cookie.get("token");

      const res = await axios.get(`${baseUrl}/api/search/${value}`, {
        headers: { Authorization: token },
        cancelToken: new CancelToken((canceler) => {
          cancel = canceler;
        }),
      });

      if (res.data.length === 0) return setLoading(false);

      setResults(res.data);
    } catch (error) {
      // alert("Error Searching");
    }

    setLoading(false);
  };

  return (
    <Search
      onBlur={() => {
        results.length > 0 && setResults([]);
        loading && setLoading(false);
        setText("");
      }}
      loading={loading}
      value={text}
      resultRenderer={ResultRenderer}
      results={results}
      onSearchChange={handleChange}
      minCharacters={1}
      onResultSelect={(e, data) => {
        if (pathString === "/qa") {
          Router.push(`qa/${data.result.username}`);
        } else {
          Router.push(`studentshub/${data.result.username}`);
        }
      }}
    />
  );
}

const ResultRenderer = ({ _id, profilePicUrl, name }) => {
  return (
    <List key={_id}>
      <List.Item>
        <Image src={profilePicUrl} alt="ProfilePic" avatar />
        <List.Content header={name} as="a" />
      </List.Item>
    </List>
  );
};

export default SearchComponent;
