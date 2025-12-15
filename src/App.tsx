import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MatchesPage } from "./pages/MatchesPage";
import { MatchDetails } from "./pages/MatchDetails";
import { Link } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { PrivateRoute } from "./components/PrivateRoute";
import { CreateMatchPage } from "./pages/CreateMatchPage";
import { SignupPage } from "./pages/SignupPage";
import { SignupEvaluation } from "./pages/SignupEvaluationPage";
import { MatchRoomPage } from "./pages/MatchRoomPage";
import { MatchRoomGuard } from "./components/MatchRoomGuard";
import { UpdateMatchPage } from "./pages/UpdateMatchPage";
import { ProfilePage } from "./pages/ProfilePage";
import { PlayersConfirmationPage } from "./pages/PlayersConfirmationPage";
import { TestMapPage } from "./components/TestMapPage";
import { DashBoardPage } from "./pages/DashBoardPage";
import { LeaguePage } from "./pages/LeaguePage";
import { CreateLeaguePage } from "./pages/CreateLeaguePage";
import { LeagueDetailsPage } from "./pages/LeagueDetailsPage";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header>
        <Navbar />
      </Header>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/evaluation" element={<SignupEvaluation />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashBoardPage />} />
          <Route
            path="/googlemap"
            element={
              <PrivateRoute>
                <TestMapPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/matches"
            element={
              <PrivateRoute>
                <MatchesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/matches/new"
            element={
              <PrivateRoute>
                <CreateMatchPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/matches/:matchId"
            element={
              <PrivateRoute>
                <MatchDetails />
              </PrivateRoute>
            }
          />

          <Route
            path="/matches/:matchId/room"
            element={
              <PrivateRoute>
                <MatchRoomGuard>
                  <MatchRoomPage />
                </MatchRoomGuard>
              </PrivateRoute>
            }
          />

          <Route
            path="/matches/:matchId/room/confirmation"
            element={
              <PrivateRoute>
                <MatchRoomGuard>
                  <PlayersConfirmationPage />
                </MatchRoomGuard>
              </PrivateRoute>
            }
          ></Route>

          <Route
            path="/matches/:matchId/update"
            element={
              <PrivateRoute>
                <UpdateMatchPage />
              </PrivateRoute>
            }
          />

          <Route path="/leagues" element={<LeaguePage />} />
          <Route path={"/league"} element={<CreateLeaguePage />} />

          <Route path={"/league/:leagueId"} element={<LeagueDetailsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
