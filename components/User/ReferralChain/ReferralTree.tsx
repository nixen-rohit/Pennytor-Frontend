"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import { ReferralState, ReferralTreeNode } from "@/components/User/ReferralChain/types";

interface Props {
  data: ReferralState;
}

function TreeNode({
  node,
  depth = 0,
}: {
  node: ReferralTreeNode;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors hover:bg-neutral-800/50 cursor-pointer ${
          depth === 0 ? "bg-indigo-500/10 border border-indigo-500/30" : ""
        }`}
        style={{ marginLeft: depth * 24 }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
          )
        ) : (
          <div className="w-4" />
        )}

        {depth === 0 ? (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600">
            <User className="h-3.5 w-3.5 text-white" />
          </div>
        ) : (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-700">
            <User className="h-3.5 w-3.5 text-slate-300" />
          </div>
        )}

        <span
          className={`text-sm font-medium ${depth === 0 ? "text-indigo-300" : "text-slate-200"}`}
        >
          {node.firstName} {node.lastName}
        </span>

        {node.userType === "super_user" && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-500/20 text-yellow-400">
            SUPER
          </span>
        )}

        {node.referralCode && (
          <div className="flex items-center gap-1 ml-auto text-xs text-slate-400">
            <span className="font-mono">{node.referralCode}</span>
          </div>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="border-l border-neutral-700 ml-[18px] mt-1">
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ReferralTree({ data }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
        <div className="text-sm text-white mb-3 px-3 ">
          Check Your Referral Chain Tree here
        </div>
        {data.treeData && data.treeData.length > 0 ? (
          data.treeData.map((node) => (
            <TreeNode key={node.id} node={node} />
          ))
        ) : (
          <div className="text-center py-8 text-slate-500 text-sm">
            No referral tree data available.
          </div>
        )}
      </div>
    </div>
  );
}
