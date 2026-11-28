export function validateMatrix(matrix) {
  if (!Array.isArray(matrix) || !matrix.length || matrix.length > 12) throw Error('Enter between 1 and 12 ambulances/incidents.');
  const n=matrix.length;
  for(let i=0;i<n;i++){
    if(!Array.isArray(matrix[i])||matrix[i].length!==n) throw Error(`Row ${i+1} must contain exactly ${n} response times.`);
    for(let j=0;j<n;j++) if(typeof matrix[i][j]!=='number'||!Number.isFinite(matrix[i][j])||matrix[i][j]<0) throw Error(`Response time at A${i+1}, E${j+1} must be a non-negative number.`);
  }
  return n;
}
function result(name,cost,assignment,stats,steps){return {name,cost,assignment,stats,steps};}
export function bruteForce(c){
 const n=validateMatrix(c); if(n>9) throw Error('Brute Force is limited to 9 incidents to keep the browser responsive.');
 let best=Infinity, bestA=[],nodes=0,leaves=0;const steps=[];
 function dfs(i,mask,sum,a){nodes++;if(i===n){leaves++;if(sum<best){best=sum;bestA=[...a];if(steps.length<160)steps.push(`New best: ${a.map((j,k)=>`A${k+1}→E${j+1}`).join(', ')} = ${sum} min`);}return;}
 for(let j=0;j<n;j++)if(!(mask&(1<<j))){a.push(j);dfs(i+1,mask|(1<<j),sum+c[i][j],a);a.pop();}}
 dfs(0,0,0,[]);return result('Brute Force',best,bestA,{nodes,leaves,pruned:0,states:0},steps);
}
export function greedy(c){
 const n=validateMatrix(c);let mask=0,cost=0,a=[],steps=[],comparisons=0;
 for(let i=0;i<n;i++){let best=Infinity,pick=-1;for(let j=0;j<n;j++)if(!(mask&(1<<j))){comparisons++;if(c[i][j]<best){best=c[i][j];pick=j;}}a.push(pick);mask|=1<<pick;cost+=best;steps.push(`A${i+1} chooses E${pick+1} (${best} min); running total ${cost} min.`);}
 return result('Greedy',cost,a,{nodes:comparisons,leaves:1,pruned:0,states:n},steps);
}
export function dynamicProgramming(c){
 const n=validateMatrix(c),size=1<<n,dp=Array(size).fill(Infinity),parents=Array(size).fill(null);dp[0]=0;let transitions=0,states=0,steps=[];
 for(let mask=0;mask<size;mask++){if(!Number.isFinite(dp[mask]))continue;states++;const i=popcount(mask);if(i===n)continue;
 for(let j=0;j<n;j++)if(!(mask&(1<<j))){transitions++;const next=mask|(1<<j),value=dp[mask]+c[i][j];if(value<dp[next]){dp[next]=value;parents[next]=[mask,j];if(steps.length<140)steps.push(`dp[${next.toString(2).padStart(n,'0')}] ← ${value} via A${i+1}→E${j+1}`);}}}
 let mask=size-1,a=Array(n);while(mask){const [prev,j]=parents[mask];a[popcount(prev)]=j;mask=prev;}
 return result('Dynamic Programming',dp[size-1],a,{nodes:transitions,leaves:1,pruned:0,states},steps);
}
function popcount(x){let n=0;while(x){x&=x-1;n++;}return n;}
export function branchAndBound(c){
 const n=validateMatrix(c);if(n>10)throw Error('Branch and Bound is limited to 10 incidents to keep the browser responsive.');
 let best=Infinity,bestA=[],nodes=0,leaves=0,pruned=0,steps=[];
 // Obtain a valid initial incumbent to make pruning effective.
 const seed=greedy(c);best=seed.cost;bestA=[...seed.assignment];steps.push(`Initial incumbent from Greedy: ${best} min.`);
 function dfs(i,mask,sum,a){nodes++;if(i===n){leaves++;if(sum<best){best=sum;bestA=[...a];if(steps.length<140)steps.push(`Improved complete assignment: ${best} min.`);}return;}
 let bound=sum;for(let row=i;row<n;row++){let m=Infinity;for(let j=0;j<n;j++)if(!(mask&(1<<j)))m=Math.min(m,c[row][j]);bound+=m;}
 if(bound>=best){pruned++;if(steps.length<140)steps.push(`Pruned depth ${i}: lower bound ${bound} ≥ incumbent ${best}.`);return;}
 const options=[];for(let j=0;j<n;j++)if(!(mask&(1<<j)))options.push(j);options.sort((a,b)=>c[i][a]-c[i][b]||a-b);
 for(const j of options){a.push(j);dfs(i+1,mask|(1<<j),sum+c[i][j],a);a.pop();}}
 dfs(0,0,0,[]);return result('Branch and Bound',best,bestA,{nodes,leaves,pruned,states:0},steps);
}
export const algorithms=[bruteForce,greedy,dynamicProgramming,branchAndBound];
export const algorithmInfo=[
 {title:'Brute Force',type:'Exhaustive Search',time:'O(n · n!)',space:'O(n)',optimal:true,description:'Enumerates all incident permutations, scores each complete assignment and keeps the lowest total.',pseudo:'best = ∞\nfor each permutation P of incidents:\n    total = Σ cost[i][P[i]]\n    if total < best:\n        best = total; answer = P\nreturn best, answer'},
 {title:'Greedy',type:'Local Choice',time:'O(n²)',space:'O(n)',optimal:false,description:'Processes ambulances in input order, assigning each to its cheapest remaining incident. Fast, but not guaranteed optimal.',pseudo:'available = all incidents\nfor each ambulance i in order:\n    j = cheapest incident in available\n    assign i to j\n    remove j from available\nreturn assignment'},
 {title:'Dynamic Programming',type:'Bitmask DP',time:'O(n · 2ⁿ)',space:'O(2ⁿ)',optimal:true,description:'Uses one state per subset of assigned incidents. For each state, tries every remaining incident for the next ambulance.',pseudo:'dp[0] = 0; other states = ∞\nfor mask in 0..2ⁿ-1:\n    i = popcount(mask)\n    for each unassigned incident j:\n        next = mask OR (1 << j)\n        dp[next] = min(dp[next], dp[mask] + cost[i][j])\nreturn dp[2ⁿ-1]'},
 {title:'Branch and Bound',type:'Pruned Search',time:'O(n² · n!) upper bound',space:'O(n²)',optimal:true,description:'Searches assignment choices but prunes branches whose optimistic lower bound cannot beat the best complete assignment.',pseudo:'best = cost of a valid greedy assignment\nsearch(row, used, cost):\n    if all assigned: update best; return\n    lower = cost + Σ minimum available cost per remaining row\n    if lower >= best: prune; return\n    for each unused incident j:\n        search(row+1, used ∪ {j}, cost+C[row][j])'}
];
