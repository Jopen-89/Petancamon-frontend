import React, { useEffect, useState, type ReactFragment } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCallback } from "react";

type Players = {
  type: string;
  targetsPlayersId:
    | {
        PlayerId: string;
        vote: string;
      }[]
    | null;
};

type Attendance = {
  hasSelf: boolean;
  player: string;
  playersYes: string[];
  playersNo: string[];
  yesCount: number,
  noCount: number,
};

type Match = {
  id: string;
  creator: string;
  level: string;
  location: string | null;
  maxPlayers: number;
  status: string;
  players: string[];
  attendance: Attendance[];
};

export const PlayersConfirmationPage = () => {
  const { matchId } = useParams();
  const { accessToken, user } = useAuth();

  const [err, setErr] = useState<string | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [form, setForm] = useState<Players>({
    type: "peer",
    targetsPlayersId: [
      {
        PlayerId: "",
        vote: "",
      },
    ],
  });

  if (!user) return <p>User doesnt exist</p>;
  const { id: userId } = user;

  useEffect(() => {
    if (!match || !user) return;

    const targets = match.players
      .filter((p) => p !== userId)
      .map((p) => ({
        PlayerId: p,
        vote: "",
      }));

    setForm((prev) => ({
      ...prev,
      targetsPlayersId: targets,
    }));
  }, [match, userId]);

  const loadMatch = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await fetch(
        `http://localhost:3000/matches/${matchId}/room`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!result.ok) {
        console.log("Server rejected the request");
      }
      const data = await result.json();

      setMatch(data.match);
    } catch (err) {
      console.log("network error, unable connect to the server");
    } finally {
      setIsLoading(false);
    }
  }, [matchId, accessToken]);

  useEffect(() => {
    loadMatch();
  }, [loadMatch]);

  if (err) return <p>{err}</p>;

  const handleclickSelf = async () => {
    if (!matchId) return;
    try {
      const result = await fetch(
        `http://localhost:3000/matches/${matchId}/room/confirmation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ type: "self" }),
        }
      );
      if (!result.ok) {
        setErr("Server rejected the request");
        return;
      }
      const data = await result.json();

      await loadMatch();
      // Opcional: recargar el partido para ver cambios
      // await loadMatch();
    } catch (err) {
      setErr("Network error, unable to connect to the server");
    }
  };

  const handleChangePeer = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    console.log("ver e target value:", e.target.value);
    if (!form.targetsPlayersId) return;

    const newTargets = [...form.targetsPlayersId];
    newTargets[index] = {
      ...newTargets[index],
      vote: e.target.value,
    };

    setForm({
      ...form,
      type: "peer",
      targetsPlayersId: newTargets,
    });
  };

  const handlePeerConfirmation = async (index: number) => {
    const targetsPlayersId = form.targetsPlayersId?.[index];
    if (!targetsPlayersId) return;
    if (!targetsPlayersId.vote) return;

    const body = {
      type: "peer",
      targetPlayerId: targetsPlayersId.PlayerId,
      vote: targetsPlayersId.vote,
    };

    console.log("a ver body", body);

    try {
      const result = await fetch(
        `http://localhost:3000/matches/${matchId}/room/confirmation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!result.ok) {
        setErr("Error doing the peer confirmation");
      }
      const data = await result.json();
      const YesCount = data.match.yesCount;
      console.log("a ver YesCount:", YesCount);

      await loadMatch();
    } catch {
      setErr("network error, unable to connect with server");
    }
  };

  if (!match) {
    return <p>Match not exists</p>;
  }

  console.log("a ver match", match.attendance);
  const attendancePlayer = match.attendance?.find((p) => p.player === userId);
  console.log("a ver attendanceplayer", attendancePlayer);
  const selfAttendance = attendancePlayer?.hasSelf;
  console.log("a ver selfattendance", selfAttendance);

  /*const getPeerVoteStatus = (playerId: string) => {
    console.log("a ver match attendance:", match.attendance);

    const attendanceEntry = match.attendance.find((a) => a.player === playerId);

    console.log("a ver attendanceEntry:", attendanceEntry)
    console.log("a ver playerId", playerId)

    if (!attendanceEntry) return null;

    if (attendanceEntry.playersYes?.includes(userId)) return "yes";
    if (attendanceEntry.playersNo?.includes(userId)) return "no";

    return null;
  };*/


  //necesito attendance del userid// luego hasYEs y hasNo// uso attendancePlayer





  return (
    <>
      <h2 className="text-white">PLAYER CONFIRMATION</h2>

      
      <div className="flex justify-around">
      <div>
      <button
        className="px-4 py2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
        onClick={handleclickSelf}
      >
        {!selfAttendance ? "Selfconfirmation" : "Confirmed"}
      </button>

      {form.targetsPlayersId?.map((tp, i) => (
        <div key={i}>
          <p>Player:{tp.PlayerId}</p>

          <select className="text-black bg-white" value={tp.vote} onChange={(e) => handleChangePeer(e, i)}>
            <option value="">Select...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <button
            type="submit"
            onClick={() => handlePeerConfirmation(i)}
            className="px-4 py2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            confirmation
          </button>
        </div>
      ))}
      </div>
      

        <div>
        <table className="border-2">
          <thead>
            <tr>
              <th className="border border-gray-500 px-4 py-2">Player</th>
              <th className="border border-gray-500 px-4 py-2">VoteYes</th>             
              <th className="border border-gray-500 px-4 py-2">VoteNo</th>
            </tr>
          </thead>
          <tbody>
            {match.attendance.map((m, i) =>  (         
            <tr key={i}>
              <td>{m.player}</td>
              <td>{m.yesCount}</td>
              <td>{m.noCount}</td>
              </tr>
            )) }
              

          </tbody>
        </table>
      </div>
      </div>
    </>
  );
};
