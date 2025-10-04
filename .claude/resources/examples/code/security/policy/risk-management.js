// Example: Security Risk Assessment and Management

class SecurityRiskManager {
  assessRisk(threat, vulnerability, asset) {
    const probability = this.calculateThreatProbability(threat);
    const impact = this.calculateBusinessImpact(asset, vulnerability);

    const riskScore = probability * impact;
    const riskLevel = this.categorizeRisk(riskScore);

    return {
      riskScore,
      riskLevel,
      threat,
      vulnerability,
      asset,
      mitigationStrategies: this.suggestMitigations(riskLevel),
      acceptanceCriteria: this.getAcceptanceCriteria(riskLevel)
    };
  }

  calculateThreatProbability(threat) {
    const factors = {
      threatActorCapability: threat.actorCapability || 3,
      threatActorMotivation: threat.actorMotivation || 3,
      vulnerabilityEaseOfExploitation: threat.exploitability || 3,
      existingControls: threat.controlsEffectiveness || 7
    };

    // Scale: 1-10, where 10 is highest probability
    return (
      factors.threatActorCapability * 0.3 +
      factors.threatActorMotivation * 0.3 +
      factors.vulnerabilityEaseOfExploitation * 0.3 -
      factors.existingControls * 0.1
    );
  }

  calculateBusinessImpact(asset, vulnerability) {
    const impacts = {
      financial: asset.financialValue * vulnerability.impactMultiplier,
      operational: asset.operationalImportance * vulnerability.availabilityImpact,
      reputation: asset.reputationalValue * vulnerability.confidentialityImpact,
      regulatory: asset.regulatoryImplications * vulnerability.integrityImpact
    };

    return Math.max(...Object.values(impacts));
  }
}