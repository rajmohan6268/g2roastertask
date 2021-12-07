import { useEffect, useState } from "react";
import "./App.css";

function App() {
  let [members, setMembers] = useState([]);
  let [isloading, SetIsloading] = useState(true);

  const persitlikes = () => {};

  let loacalArray = [
    {
      bio: "a",
      image_url: "/5.jpg",
      name: "a",
      title: "C00",
      likes: 9,
    },
    {
      bio: "b",
      image_url: "/3.jpg",
      name: "b",
      title: "CTO ",
      likes: 3,
    },
    {
      bio: "b",
      image_url: "/3.jpg",
      name: "sb",
      title: "CTO ",
      likes: 3,
    },
    {
      bio: "c",
      image_url: "/3.jpg",
      name: "M3",
      title: "CbO ",
      likes: 3,
    },
  ];

  let apiArray = [
    {
      bio: "a",
      image_url: "/5.jpg",
      name: "a",
      title: "C00",
    },
    {
      bio: "sb",
      image_url: "/3.jpg",
      name: "sb",
      title: "CTO ",
    },
    {
      bio: "c",
      image_url: "/3.jpg",
      name: "M3",
      title: "CbO ",
    },
  ];

  function findArrayElementofArr1nameinArr2Name(member, loacalArray) {
    let a = loacalArray.find((element) => {
      if (element["name"] === member["name"]) {
        return element;
      } else {
        return null;
      }
    });
    return a?.likes || 0;
  }

  function mergearr1witharr2byindex(loacalArray, apiArray) {
    let persitedArr = apiArray.map((member, index) => {
      return {
        ...member,
        likes: findArrayElementofArr1nameinArr2Name(member, loacalArray),
      };
    });
    return persitedArr;
  }
  const storeuserinfoinlocalstorage = (data) => {
    localStorage.setItem("loacalArray", JSON.stringify(data));
  };

  useEffect(() => {
    fetch("https://coding-assignment.g2crowd.com")
      .then((response) => response.json())
      .then((data) => {
        storeuserinfoinlocalstorage(data);

        setMembers(data);
      })
      .then(() => {
        console.log(
          mergearr1witharr2byindex(loacalArray, apiArray),
          "mergarr1Andarr2"
        );

        let persistLikeforMembers = localStorage.getItem(
          "persistLikeforMembers"
        );

        if (persistLikeforMembers) {
          //  setMembers(JSON.parse(persistLikeforMembers));
          mergearr1witharr2byindex(JSON.parse(persistLikeforMembers), apiArray);
        }
      })
      .catch((error) => console.log(error, "err"))
      .finally(() => {
        console.log(members, "^^^^^^^^^^^^^^^^^^^^^");

        SetIsloading(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("persistLikeforMembers", JSON.stringify(members));
  }, []);

  return (
    <div className="grid h-screen ">
      <div className="m-auto ">
        {isloading ? (
          <>loading...</>
        ) : (
          <>
            <div className="container max-w-5xl mx-auto my-10 divide-y ">
              <div className="mb-3 text-4xl font-light text-orage">
                G2Crowd Crowd Team Roster
              </div>
              {members &&
                members.map((list, index) => (
                  <>
                    <div
                      className="flex items-center py-4 space-x-4 text-gray"
                      key={index}
                    >
                      <div className="flex-shrink-0 w-48 h-48 bg-gray-100 border border-opacity-10 boder-gray-50">
                        <img
                          alt="user avatar"
                          className="w-full h-full "
                          src={list.image_url}
                        />
                      </div>
                      <div className="flex flex-col justify-evenly">
                        <h4 className="text-2xl text-gray-600">{list.name}</h4>
                        <h3 className="text-xl text-gray-600"> {list.title}</h3>

                        <div className="h-20 overflow-hidden overflow-ellipsis">
                          <p className="text-sm ">{list.bio}</p>
                        </div>
                        <div className="flex items-baseline font-bold text-gray-500">
                          Want to work with {list.name}
                          <span className="flex items-center ml-2 text-blue">
                            <img className="w-4" alt="" src="thumbs-up.svg" />
                            Yes!
                          </span>
                        </div>
                        <div className="">
                          <span className="font-bold text-gray-600">15</span>{" "}
                          people have said Yes!
                        </div>
                      </div>
                    </div>

                    {/* {JSON.stringify(list)} */}
                  </>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
