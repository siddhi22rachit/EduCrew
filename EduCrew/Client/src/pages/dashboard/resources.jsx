import React, { useState } from "react";
import { FileText, Video, ChevronRight } from "lucide-react";

const ResourcesPage = () => {
  const [groups, setGroups] = useState([
    {
      name: "Physics Study Group 1",
      resources: [
        {
          type: "pdf",
          name: "Quantum States Guide",
          author: "John Doe",
          date: "2024-03-15",
        },
        {
          type: "video",
          name: "Wave Functions Explained",
          author: "Sarah Smith",
          date: "2024-03-14",
        },
        {
          type: "pdf",
          name: "Practice Problems Set",
          author: "Mike Johnson",
          date: "2024-03-13",
        },
        {
          type: "pdf",
          name: "Calculus Concepts",
          author: "Jane Doe",
          date: "2024-04-01",
        },
        {
          type: "video",
          name: "Linear Algebra Tutorials",
          author: "Bob Smith",
          date: "2024-03-28",
        },
      ],
    },
    {
      name: "Math Club",
      resources: [
        {
          type: "pdf",
          name: "Calculus Concepts",
          author: "Jane Doe",
          date: "2024-04-01",
        },
        {
          type: "video",
          name: "Linear Algebra Tutorials",
          author: "Bob Smith",
          date: "2024-03-28",
        },
      ],
    },
    {
      name: "Reading Group",
      resources: [
        {
          type: "pdf",
          name: "Book Club Discussion Guide",
          author: "Sarah Lee",
          date: "2024-05-15",
        },
        {
          type: "pdf",
          name: "Literary Analysis Template",
          author: "Michael Johnson",
          date: "2024-05-10",
        },
      ],
    },
  ]);

  const [showMoreResources, setShowMoreResources] = useState({});

  const toggleShowMore = (groupName) => {
    setShowMoreResources((prevState) => ({
      ...prevState,
      [groupName]: !prevState[groupName],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-8">All Resources</h1>
      {groups.map((group) => (
        <div key={group.name} className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">{group.name}</h2>
            <button
              onClick={() => toggleShowMore(group.name)}
              className="px-3 py-1.5 rounded-lg text-sm bg-gray-800 hover:bg-gray-700 text-gray-400 flex items-center gap-1 transition-colors"
            >
              See {showMoreResources[group.name] ? "Less" : "More"}
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  showMoreResources[group.name] ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${
              showMoreResources[group.name] ? "" : "max-h-24 overflow-hidden"
            }`}
          >
            {group.resources.map((resource, index) => (
              <div
                key={`${group.name}-${index}`}
                className="bg-gray-800 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-700 transition-colors"
              >
                {resource.type === "pdf" ? (
                  <FileText className="w-5 h-5 text-fuchsia-500" />
                ) : (
                  <Video className="w-5 h-5 text-cyan-400" />
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium">{resource.name}</div>
                  <div className="text-xs text-gray-400">
                    By {resource.author} - {resource.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourcesPage;