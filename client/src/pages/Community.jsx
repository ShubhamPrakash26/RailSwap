import DashboardLayout from "../components/layout/DashboardLayout";
import { useState } from 'react';

import CommunitySelector from "../components/community/CommunitySelector";
import RaiseIssueForm from "../components/community/RaiseIssueForm";
import IssueList from "../components/community/IssueList";
import StationTips from "../components/community/StationTips";
import SafetyRatings from "../components/community/SafetyRatings";
import FoodRecommendations from "../components/community/FoodRecommendations";

export default function Community() {
  const [selected, setSelected] = useState({});

  return (
    <DashboardLayout>

      <div className="space-y-8">

        <CommunitySelector onSelect={setSelected} />

        <RaiseIssueForm selected={selected} />

        <IssueList selected={selected} />

        <div className="grid md:grid-cols-3 gap-6">

          <StationTips />

          <SafetyRatings />

          <FoodRecommendations />

        </div>

      </div>

    </DashboardLayout>
  );
}