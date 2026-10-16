import { ClaudeAcpAgent } from "./node_modules/@agentclientprotocol/claude-agent-acp/dist/lib.js";
const stop = ClaudeAcpAgent.prototype.stopAsyncTask;
ClaudeAcpAgent.prototype.stopAsyncTask = async function (params) {
  const id = String(params.asyncTaskId);
  if (!id.startsWith("sandshell:")) return stop.call(this, params);
  const req = JSON.parse(Buffer.from(id.slice(10), "base64url").toString());
  const q = this.sessions[params.sessionId]?.query;
  if (!q) throw new Error("No such session");
  let result;
  switch (req.op) {
    case "rewind": result = await q.rewindFiles(req.uuid, { dryRun: !!req.dryRun }); break;
    case "mcpStatus": result = await q.mcpServerStatus(); break;
    case "mcpReconnect": await q.reconnectMcpServer(req.name); result = await q.mcpServerStatus(); break;
    case "mcpToggle": await q.toggleMcpServer(req.name, !!req.enabled); result = await q.mcpServerStatus(); break;
    default: throw new Error("Unknown Sandshell request " + req.op);
  }
  return { stopped: false, _meta: { sandshell: result ?? null } };
};
await import("./node_modules/@agentclientprotocol/claude-agent-acp/dist/index.js");
