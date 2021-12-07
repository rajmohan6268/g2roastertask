import { useEffect, useState } from "react";
import "./App.css";

function App() {
  let [members, setMembers] = useState([]);
  let [isloading, SetIsloading] = useState(true);

  //function to find  mebers liked by member name
  function findAndSetMembersdata(member, loacalArray) {
    let user = loacalArray.find((element) => {
      if (element["name"] === member["name"]) {
        return element;
      } else {
        return 0;
      }
    });

    return user?.likes ? user.likes : 0;
  }

  // function to merge likes data from  local storage to api members data
  function MergeLocaldatatoApiData(loacalArray, apiArray) {
    let persitedArr = apiArray.map((member, index) => {
      return {
        ...member,
        likes: findAndSetMembersdata(member, loacalArray),
      };
    });
    return persitedArr;
  }

  const getLocatdata = () => {
    let persistLikeforMembers = JSON.parse(
      localStorage.getItem("persistLikeforMembers")
    );
    if (persistLikeforMembers) {
      return persistLikeforMembers;
    } else {
      return [];
    }
  };

  const storeuserinfoinlocalstorage = (data) => {
    localStorage.setItem("persistLikeforMembers", JSON.stringify(data));
  };

  const setLikes = (list, index) => {
    //   console.log("liked ===>", list, "position====>", index);

    let datatostore = [...members];

    datatostore[index].likes = datatostore[index].likes + 1;
    datatostore[index].isIliked = true;
    storeuserinfoinlocalstorage(datatostore);
    setMembers(datatostore);
  };

  // event listener for synk in likes
  useEffect(() => {
    setMembers(getLocatdata() || []);

    window.addEventListener("storage", (e) => {
      if (e.key === "persistLikeforMembers") {
        setMembers(JSON.parse(e.newValue));
      }
    });

    return () => {
      window.removeEventListener("storage", (e) => {
        if (e.key === "persistLikeforMembers") {
          setMembers(JSON.parse(e.newValue));
        }
      });
    };
  }, []);
  // to fetch data from api
  useEffect(() => {
    fetch("https://coding-assignment.g2crowd.com")
      .then((response) => response.json())

      .then((data) => {
        setMembers(data);

        let persistLikeforMembers = JSON.parse(
          localStorage.getItem("persistLikeforMembers")
        );

        if (persistLikeforMembers) {
          // console.log(  MergeLocaldatatoApiData(persistLikeforMembers, data),   "mergarr1Andarr2"    );

          setMembers(MergeLocaldatatoApiData(persistLikeforMembers, data));
        } else {
          let initialdata = data.map((member) => {
            return {
              ...member,
              likes: 0,
              isIliked: false,
            };
          });
          storeuserinfoinlocalstorage(initialdata);
          //  console.log("no data in local storage");

          setMembers(initialdata);
        }
      })
      .catch(async (error) => {
        console.log(error, "err");
        // to reload window if api is not working or not reachable
        var st = setTimeout(() => {
          window.location.reload();
          clearTimeout(st);
        }, 3000);
      })
      .finally(() => {
        SetIsloading(false);
      });
  }, []);

  return (
    <div className="p-3 ">
      <div className="w-full m-auto ">
        <div className="container w-full max-w-5xl mx-auto my-4 divide-y lg:my-10 ">
          <div className="w-full mb-3 text-2xl font-light lg:text-4xl text-orage">
            G2Crowd Crowd Team Roster
          </div>
          {isloading ? (
            <>
              {[1, 1, 1, 1, 1, 1].map((loader, index) => {
                return (
                  <div>
                    {/* loading screen */}
                    <div
                      id={index}
                      className="flex items-start w-full py-4 space-x-4 animate-pulse md:items-center text-gray"
                      key={index}
                    >
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-100 border md:w-48 md:h-48 border-opacity-10 boder-gray-50"></div>
                      <div className="w-full space-y-3">
                        <div className="w-6/12 p-1 bg-gray-200 md:p-2 md:w-60 " />

                        <div className="w-3/12 p-1 bg-gray-200 md:w-40 md:p-2" />

                        <div className="hidden w-full p-1 bg-gray-200 md:flex md:p-2" />
                        <div className="w-10/12 p-1 bg-gray-200 md:p-2" />
                        <div className="w-8/12 p-1 bg-gray-200 md:p-2" />
                        <div className="p-1.5 bg-gray-200 w-60 hidden md:flex" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {members &&
                members.map((list, index) => (
                  <>
                    {/* cards */}
                    <div>
                      <div
                        id={index}
                        className="flex items-start py-4 space-x-4 md:items-center text-gray"
                        key={index}
                      >
                        <div className="flex-shrink-0 w-20 bg-gray-100 border md:w-48 md:h-48 border-opacity-10 boder-gray-50">
                          <img
                            alt="user avatar"
                            className="w-full h-full "
                            src={list.image_url}
                          />
                        </div>
                        <div className="flex flex-col justify-evenly">
                          <h4 className="text-xl text-gray-600 md:text-2xl">
                            {list.name}
                          </h4>
                          <h3 className="text-lg text-gray-600 md:text-xl">
                            {" "}
                            {list.title}
                          </h3>

                          <div className="h-20 overflow-hidden overflow-ellipsis">
                            <p className="text-xs md:text-sm ">{list.bio}</p>
                          </div>
                          <div className="flex items-baseline justify-between text-sm font-semibold text-gray-500 md:justify-start md:font-bold md:text-base">
                            <div>Want to work with {list.name}</div>
                            <button
                              onClick={() => {
                                setLikes(list, index);
                              }}
                              className="flex items-center mx-2 text-blue"
                            >
                              <img className="w-4" alt="" src="thumbs-up.svg" />
                              {list.likes > 0 ? "Yes!" : ""}
                            </button>
                          </div>
                          {list.likes > 0 ? (
                            <>
                              <div className="text-sm md:text-base ">
                                <span className="mr-2 font-bold text-gray-600">
                                  {list.likes || "0"}
                                </span>
                                people have said Yes!
                              </div>
                            </>
                          ) : (
                            <> </>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* {JSON.stringify(list)} */}
                  </>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
