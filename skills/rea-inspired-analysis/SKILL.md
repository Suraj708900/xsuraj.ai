---
name: rea-inspired-analysis
version: "1.0"
description: Evidence-led analysis of software artifacts using available tools, inspired by morluto/rea's reverse-engineer-anything workflow. This is NOT the official REA skill or MCP implementation.
---

# Evidence-led software analysis (REA-inspired)

## Scope
Use for user-authorized review of applications, binary/package artifacts, websites, JavaScript bundles, or behavior where source files alone do not establish the answer. For a complete ordinary source repository, prefer direct source/code review and tests rather than claiming reverse-engineering tools are necessary.

## Workflow
1. Determine what the user owns or is authorized to analyze and what precise question they need answered.
2. Identify the artifact type: web page, source tree, JavaScript/Electron bundle, APK/ZIP, managed .NET assembly, native executable, or captured network log.
3. Inventory the exact artifact, file paths and versions. Prefer read-only inspection. Do not run untrusted binaries or dynamic instrumentation without explicit consent.
4. Use only actually available tools. Never claim a local REA MCP connection, Ghidra, Hopper, IDA, packet analyzer, or runtime evidence unless connected and used.
5. Start with a concise summary, then trace only the relevant files/functions/observations; avoid broad unrelated dumps.
6. Distinguish **observed facts**, **derived facts**, **hypotheses**, and **unknowns**. Attach file links, line numbers, outputs or hashes when possible.
7. Record limitations, coverage gaps, possible side effects, and the next safe verification step.
8. When recreating a feature, make an original implementation instead of copying protected branding or representing fictional claims as real.
9. For configuration edits: show scope, preserve backups, use idempotent changes, ask before installing software, and verify after changes.

## Evidence report format
- **Target:** artifact/source, version, and scope
- **Question:** what the user wants understood
- **Observations:** directly verifiable evidence
- **Interpretation:** what evidence supports and confidence level
- **Unknowns:** not confirmed / missing tools
- **Implementation plan:** original authorized changes
- **Verification:** tests and actual results (or not tested)

## Connecting the official tool
The original REA repository's `reverse-engineer-anything` skill is an instruction file only. Installing a skill does not by itself register the REA MCP server, analysis providers, or new tools in ChatGPT. To use the actual REA capabilities, install/configure official REA in a supported coding agent and verify that its MCP tools appear. Consult the upstream installation guide and review planned changes before approving.

## Attribution
This is an original, shortened adaptation informed by the MIT-licensed project `morluto/rea` (Copyright (c) 2026 morluto); it is **not** a verbatim copy of the original `SKILL.md` and does **not** contain REA's server or reverse-engineering implementation. Source: https://github.com/morluto/rea and upstream skill: https://github.com/morluto/rea/blob/main/.agents/skills/reverse-engineer-anything/SKILL.md .
