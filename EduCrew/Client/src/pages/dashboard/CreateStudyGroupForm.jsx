import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";

const CreateStudyGroupForm = () => {
  const [formData, setFormData] = useState({
    groupName: "",
    members: [],
    totalMembers: 1, // Default to 1 (creator)
  });

  const navigate = useNavigate();

  // Get the current user from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("currentUser"));
    if (userData) {
      setFormData((prevState) => ({
        ...prevState,
        members: [userData.email], // Add the current user's email as a member
        totalMembers: 1,
      }));
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle member addition
  const handleAddMember = (email) => {
    if (email && !formData.members.includes(email)) {
      setFormData((prevState) => ({
        ...prevState,
        members: [...prevState.members, email],
        totalMembers: prevState.totalMembers + 1,
      }));
    }
  };

  // Handle member removal
  const handleRemoveMember = (email) => {
    setFormData((prevState) => ({
      ...prevState,
      members: prevState.members.filter((member) => member !== email),
      totalMembers: prevState.totalMembers - 1,
    }));
  };

  // Send invitation email using EmailJS
  const sendInvitation = (memberEmail, groupName, groupId) => {
    console.log("Sending email to:", memberEmail);  // Log the member email for debugging

    if (!memberEmail) {
      console.error("Email is empty!");  // If the email is empty, log an error and return
      return;
    }

    const templateParams = {
      to_email: memberEmail,  // Ensure this is populated
      from_name: "EduCrew",  // Sender's name
      group_name: groupName,  // Group name
      invite_link: `http://localhost:5173/dashboard/group/${groupId}`,  // Invite link
      reply_to: memberEmail,  // Reply to email address
    };

    emailjs
      .send(
        "service_es20wwj",  // Replace with your EmailJS Service ID
        "template_2b2f9xh",  // Replace with your EmailJS Template ID
        templateParams,
        "vlcSNai7fHKZRwlbQ"  // Replace with your EmailJS Public Key
      )
      .then(
        (result) => {
          console.log("Email sent successfully:", result.text);
        },
        (error) => {
          console.error("Error sending email:", error);
        }
      );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.groupName.trim()) {
      toast.error("Group name is required");
      return;
    }

    try {
      // Prepare the request payload
      const payload = {
        groupName: formData.groupName.trim(),
        members: formData.members,
        totalMembers: formData.totalMembers,
      };

      // Send POST request to create group
      const response = await axios.post("http://localhost:5000/api/groups", payload);

      if (response.status === 201) {
        const groupId = response.data.group._id;

        // Send invitations to all members, including the creator
        formData.members.forEach((memberEmail) => {
          console.log("Sending invitation to:", memberEmail);  // Log email being sent for debugging
          sendInvitation(memberEmail, formData.groupName, groupId);
        });

        toast.success("Group created successfully!");

        // Navigate to the tasks page for the new group
        navigate(`/dashboard/tasks/${groupId}`);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Failed to create group");
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Error creating group. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Create Study Group</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group Name Input */}
          <div>
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              name="groupName"
              value={formData.groupName}
              onChange={handleChange}
              placeholder="Enter group name"
              className="w-full bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 p-2 text-white"
              required
            />
          </div>

          {/* Members Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Add Members
            </label>
            <div className="flex">
              <input
                type="email"
                placeholder="Member email"
                className="flex-grow bg-gray-700 rounded-l-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 p-2 text-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddMember(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <button
                type="button"
                className="bg-purple-500 text-white px-4 rounded-r-lg hover:bg-purple-600"
                onClick={(e) => {
                  const emailInput = e.target.previousSibling;
                  handleAddMember(emailInput.value);
                  emailInput.value = "";
                }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Added Members List */}
          {formData.members.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-3">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Added Members</h3>
              <div className="space-y-2">
                {formData.members.map((email, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-600 rounded p-2"
                  >
                    <span className="text-white">{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(email)}
                      className="text-red-400 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Members Display */}
          <div className="text-gray-300 text-sm">Total Members: {formData.totalMembers}</div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-400 text-white font-medium py-2 px-4 rounded-lg hover:from-purple-600 hover:to-blue-500 transition-all duration-300"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStudyGroupForm;
