// Phase 12 regression suite (integration, testing & polish).
//
// Covers dependency-free server units that are easy to break during
// refactors: blueprint payload normalization and team invite codes.
//
// Run: `node --test tests/` from the server directory.

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { normalizeProjectData } from "../src/utils/normalizeProjectData.js";
import { generateInviteCode } from "../src/utils/generateInviteCode.js";

describe("normalizeProjectData", () => {
  it("leaves non-object payloads untouched", () => {
    assert.equal(normalizeProjectData(null), null);
    assert.equal(normalizeProjectData("title"), "title");
  });

  it("splits comma-separated strings into trimmed, non-empty arrays", () => {
    const result = normalizeProjectData({
      objectives: " Build UI , , Fix bugs,Deploy ",
      technologies: "React, Node, ",
    });

    assert.deepEqual(result.objectives, ["Build UI", "Fix bugs", "Deploy"]);
    assert.deepEqual(result.technologies, ["React", "Node"]);
  });

  it("cleans string arrays and drops empty entries", () => {
    const result = normalizeProjectData({
      targetUsers: [" Students ", "", "  ", null, "Faculty"],
    });

    assert.deepEqual(result.targetUsers, ["Students", "Faculty"]);
  });

  it("converts non-array list fields to empty arrays instead of corrupt shapes", () => {
    const result = normalizeProjectData({
      objectives: 42,
      features: "not-an-array",
      sdgs: { goal: "Quality Education" },
    });

    assert.deepEqual(result.objectives, []);
    assert.deepEqual(result.features, []);
    assert.deepEqual(result.sdgs, []);
  });

  it("normalizes features from strings and objects", () => {
    const result = normalizeProjectData({
      features: [
        " Login page ",
        { name: " Dashboard ", isCore: false },
        { name: "Reports" },
        { name: "   " },
        42,
      ],
    });

    assert.deepEqual(result.features, [
      { name: "Login page", isCore: true },
      { name: "Dashboard", isCore: false },
      { name: "Reports", isCore: true },
    ]);
  });

  it("normalizes SDG mappings from strings and objects", () => {
    const result = normalizeProjectData({
      sdgs: [
        " Quality Education ",
        { goal: "Climate Action", reason: "Solar sync", impact: "High" },
        { goal: "   " },
        null,
      ],
    });

    assert.deepEqual(result.sdgs, [
      { goal: "Quality Education", reason: "", impact: "" },
      { goal: "Climate Action", reason: "Solar sync", impact: "High" },
    ]);
  });

  it("keeps absent fields absent so updates do not wipe untouched values", () => {
    const result = normalizeProjectData({ title: "Only a title" });

    assert.equal(result.title, "Only a title");
    assert.equal(result.objectives, undefined);
    assert.equal(result.features, undefined);
    assert.equal(result.sdgs, undefined);
  });
});

describe("generateInviteCode", () => {
  it("generates codes in the ASC-XXXXXX format without ambiguous characters", () => {
    for (let i = 0; i < 25; i += 1) {
      const code = generateInviteCode();
      assert.match(code, /^ASC-[A-Z2-9]{6}$/);
      assert.ok(!/[01ILO]/.test(code), `ambiguous character in ${code}`);
    }
  });

  it("generates unique codes across a batch", () => {
    const batch = new Set(
      Array.from({ length: 200 }, () => generateInviteCode())
    );
    assert.equal(batch.size, 200);
  });
});
