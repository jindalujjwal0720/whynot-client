import Axios from "axios";
import { auth } from "../config/firebase";
const axios = Axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;

const useServer = () => {
  const login = async ({ uid, email, name, photoURL }) => {
    return axios
      .post("/user/login", {
        email,
        uid,
        name,
        photoURL,
      })
      .then((res) => {
        return res.data.user;
      })
      .catch((err) => {
        auth.signOut();
      });
  };

  const getIssues = async ({ uid, email, limit, lastIssue }) => {
    return axios
      .get("/issue/get", {
        params: {
          email,
          uid,
          limit,
          lastIssue,
        },
      })
      .then((res) => {
        return res.data.issues;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const getIssueById = async ({ uid, email, id }) => {
    return axios
      .get(`/issue/get/${id}`, {
        params: {
          email,
          uid,
        },
      })
      .then((res) => {
        return res.data.issue;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const createIssue = async ({ uid, email, issue }) => {
    return axios
      .post(
        "/issue/create",
        {
          ...issue,
        },
        {
          params: {
            uid,
            email,
          },
        }
      )
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const updateIssue = async ({ uid, email, issue }) => {
    return axios
      .patch(
        `/issue/update/${issue._id}`,
        {
          ...issue,
        },
        {
          params: {
            uid,
            email,
          },
        }
      )
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const deleteIssue = async ({ uid, email, issue }) => {
    return axios
      .delete(`/issue/delete/${issue._id}`, {
        params: {
          uid,
          email,
        },
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const upvoteIssue = async ({ uid, email, issue }) => {
    return axios
      .post(
        `/issue/upvote/${issue._id}`,
        {},
        {
          params: {
            uid,
            email,
          },
        }
      )
      .then((res) => {
        return res.data.issue;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const downvoteIssue = async ({ uid, email, issue }) => {
    return axios
      .post(
        `/issue/downvote/${issue._id}`,
        {},
        {
          params: {
            uid,
            email,
          },
        }
      )
      .then((res) => {
        return res.data.issue;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const reportIssue = async ({ uid, email, issue }) => {
    return axios
      .post(
        `/issue/report/${issue._id}`,
        {},
        {
          params: {
            uid,
            email,
          },
        }
      )
      .then((res) => {
        return res.data.issue;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const commentIssue = async ({ uid, email, issue, content }) => {
    return axios
      .post(
        `/issue/comment/${issue._id}`,
        { content },
        {
          params: {
            uid,
            email,
          },
        }
      )
      .then((res) => {
        return res.data.comment;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const cureIssue = async ({ uid, email, issue, content }) => {
    return axios
      .post(
        `/issue/cure/${issue._id}`,
        {
          content,
        },
        {
          params: {
            uid,
            email,
          },
        }
      )
      .then((res) => {
        return res.data.cure;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const getIssueComments = async ({
    uid,
    email,
    issue,
    limit,
    lastComment,
  }) => {
    return axios
      .get(`/issue/get/${issue._id}/comments`, {
        params: {
          email,
          uid,
          limit,
          lastComment,
        },
      })
      .then((res) => {
        return res.data.comments;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const getIssueCures = async ({ uid, email, issue, limit, lastCure }) => {
    return axios
      .get(`/issue/get/${issue._id}/cures`, {
        params: {
          email,
          uid,
          limit,
          lastCure,
        },
      })
      .then((res) => {
        return res.data.cures;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const getIssuesWithCategory = async ({
    email,
    uid,
    category,
    limit,
    lastIssue,
  }) => {
    return axios
      .get(`/issue/get/category`, {
        params: {
          email,
          uid,
          category,
          limit,
          lastIssue,
        },
      })
      .then((res) => {
        return res.data.issues;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const getIssuesWithTags = async ({ tags, email, uid, limit, lastIssue }) => {
    return axios
      .get(`/issue/get/tags`, {
        params: {
          email,
          uid,
          tags,
          limit,
          lastIssue,
        },
      })
      .then((res) => {
        return res.data.issues;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const getIssueCategories = async ({ uid, email }) => {
    return axios
      .get(`/issue/get/categories`, {
        params: {
          uid,
          email,
        },
      })
      .then((res) => {
        return res.data.categories;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const upvoteComment = async ({ uid, email, comment }) => {
    return axios
      .post(
        `/comment/upvote/${comment._id}`,
        {},
        {
          params: {
            uid,
            email,
          },
        }
      )
      .then((res) => {
        return res.data.comment;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const downvoteComment = async ({ uid, email, comment }) => {
    return axios
      .post(
        `/comment/downvote/${comment._id}`,
        {},
        {
          params: {
            uid,
            email,
          },
        }
      )
      .then((res) => {
        return res.data.comment;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const reportComment = async ({ uid, email, comment }) => {
    return axios
      .post(
        `/comment/report/${comment._id}`,
        {},
        {
          params: {
            uid,
            email,
          },
        }
      )
      .then((res) => {
        return res.data.comment;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const upvoteCure = async ({ uid, email, cure }) => {
    return axios
      .post(
        `/cure/upvote/${cure._id}`,
        {},
        {
          params: {
            uid,
            email,
          },
        }
      )
      .then((res) => {
        return res.data.cure;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const downvoteCure = async ({ uid, email, cure }) => {
    return axios
      .post(
        `/cure/downvote/${cure._id}`,
        {},
        {
          params: {
            uid,
            email,
          },
        }
      )
      .then((res) => {
        return res.data.cure;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const reportCure = async ({ uid, email, cure }) => {
    return axios
      .post(
        `/cure/report/${cure._id}`,
        {},
        {
          params: {
            uid,
            email,
          },
        }
      )
      .then((res) => {
        return res.data.cure;
      })
      .catch((err) => {
        throw (
          err.response.data.message ||
          err.response.data.error ||
          err.message ||
          "Something went wrong"
        );
      });
  };

  const value = {
    userFunctions: {
      login,
    },
    apiFunctions: {
      getIssueCategories,
      getIssues,
      getIssueById,
      createIssue,
      updateIssue,
      deleteIssue,
      upvoteIssue,
      downvoteIssue,
      reportIssue,
      commentIssue,
      cureIssue,
      getIssueComments,
      getIssueCures,
      getIssuesWithCategory,
      getIssuesWithTags,
      upvoteComment,
      downvoteComment,
      reportComment,
      upvoteCure,
      downvoteCure,
      reportCure,
    },
  };
  return value;
};

export default useServer;
