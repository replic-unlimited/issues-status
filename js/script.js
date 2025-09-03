let issuesData = [];

async function loadIssues() {
  const response = await fetch("issues-status/issues.json");
  const data = await response.json();
  issuesData = data.issues;

  renderIssues(issuesData);

  document.getElementById("last-updated").textContent = `Última atualização: ${new Date(
    data.updated_at
  ).toLocaleString()}`;
}

function renderIssues(issues) {
  const container = document.getElementById("issues");
  container.innerHTML = "";

  issues
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .forEach((issue) => {
      const assigneesHtml =
        issue.assignees.length > 0
          ? issue.assignees
              .map(
                (a) => `
                  <a href="${a.html_url}" target="_blank" class="flex items-center gap-2">
                    <img src="${a.avatar_url}" alt="${a.login}" class="w-6 h-6 rounded-full">
                    <span class="text-sm text-blue-600">${a.login}</span>
                  </a>
                `
              )
              .join("")
          : `<span class="text-sm text-gray-500 italic">Não atribuído</span>`;

      const labelsHtml = issue.labels
        .map((l) => `<span class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">${l}</span>`)
        .join(" ");

      const closedHtml = issue.closed_at
        ? `<p class="text-sm text-gray-600"><strong>Fechada:</strong> ${new Date(issue.closed_at).toLocaleString()}</p>`
        : "";

      const card = `
        <div class="p-4 bg-white rounded shadow flex flex-col justify-between hover:shadow-lg transition">
          <div>
            <h2 class="text-lg font-semibold mb-2">${issue.title}</h2>
            <div class="flex flex-wrap gap-1 mb-2">${labelsHtml}</div>
            <p class="text-sm text-gray-700 mb-1"><strong>Status:</strong> ${issue.state}</p>
            <p class="text-sm text-gray-700 mb-1"><strong>Abertura:</strong> ${new Date(
              issue.created_at
            ).toLocaleString()}</p>
            ${closedHtml}
          </div>
          <div class="mt-3 border-t pt-2">
            <p class="text-sm font-medium mb-1">Atribuído a:</p>
            <div class="flex flex-wrap gap-2">${assigneesHtml}</div>
          </div>
        </div>
      `;

      container.innerHTML += card;
    });
}

function filterIssues(state) {
  if (state === "all") {
    renderIssues(issuesData);
  } else {
    renderIssues(issuesData.filter((issue) => issue.state === state));
  }
}

loadIssues();
