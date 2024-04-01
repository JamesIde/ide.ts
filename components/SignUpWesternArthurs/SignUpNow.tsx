import { addEmailToAudienceList } from "lib/api/api";
import { useState } from "react";

function SignUpNow() {
  const [email, setEmail] = useState("");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  /**
   * Not a fan, messy, but gets the job done.
   * I think I am learning to appreciate how good angular is in regards to making requests and handling errors
   */
  const addEmailToList = async () => {
    if (!email) return;
    try {
      const r = await addEmailToAudienceList(email);
      if (r.status === 201) {
        setSuccess(true);
        setEmail("");
      }
    } catch (error) {
      setError(true);
    }

    setTimeout(() => {
      setError(false);
      setSuccess(false);
    }, 5000);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row pt-2 gap-2">
        <input
          id="email"
          type="email"
          className="text-gray-700 bg-white border rounded-md p-2 md:w-[65%]"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <button
          onClick={addEmailToList}
          className="p-2 bg-emerald-700 hover:duraton-500 hover:bg-emerald-900  rounded-md text-white font-bold"
        >
          Sign Up Now
        </button>
      </div>
      <div>
        {error && <small>❌ Error! Could not register your interest.</small>}
        {success && (
          <small>🎉 Success! Thank you for registering your interest. </small>
        )}
      </div>
    </>
  );
}
export default SignUpNow;
