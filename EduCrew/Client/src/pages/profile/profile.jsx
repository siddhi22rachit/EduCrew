import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../../firebase';
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../../redux/user/userSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);
  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut())
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1d27] rounded-lg p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500">StudySync</h1>
          <h2 className="text-2xl font-semibold mt-4">Update Profile</h2>
          <p className="text-gray-400 mt-2">Modify your account settings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              {formData.profilePicture || currentUser.profilePicture ? (
                <img
                  src={formData.profilePicture || currentUser.profilePicture}
                  alt="profile"
                  className="h-24 w-24 rounded-full object-cover cursor-pointer ring-4 ring-blue-500"
                  onClick={() => fileRef.current.click()}
                />
              ) : (
                <div
                  onClick={() => fileRef.current.click()}
                  className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer ring-4 ring-blue-500"
                >
                  <User size={48} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {(imageError || imagePercent > 0) && (
            <p className="text-sm text-center">
              {imageError ? (
                <span className="text-red-500">
                  Error uploading image (file size must be less than 2 MB)
                </span>
              ) : imagePercent < 100 ? (
                <span className="text-blue-400">{`Uploading: ${imagePercent}%`}</span>
              ) : (
                <span className="text-green-500">Image uploaded successfully</span>
              )}
            </p>
          )}

          <div className="space-y-4">
            <div className="relative">
              <input
                defaultValue={currentUser.username}
                type="text"
                id="username"
                placeholder="Username"
                className="w-full bg-[#2a2e3c] rounded-lg p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <input
                defaultValue={currentUser.email}
                type="email"
                id="email"
                placeholder="Email address"
                className="w-full bg-[#2a2e3c] rounded-lg p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="w-full bg-[#2a2e3c] rounded-lg p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white p-4 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Update Profile'}
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm">
          <button
            onClick={handleDeleteAccount}
            className="text-red-500 hover:text-red-400 transition-all"
          >
            Delete Account
          </button>
          <button
            onClick={handleSignOut}
            className="text-red-500 hover:text-red-400 transition-all"
          >
            Sign Out
          </button>
        </div>

        {error && (
          <p className="mt-4 text-center text-red-500">Something went wrong!</p>
        )}
        {updateSuccess && (
          <p className="mt-4 text-center text-green-500">
            Profile updated successfully!
          </p>
        )}
      </div>
    </div>
  );
}
