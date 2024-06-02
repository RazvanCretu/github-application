const removeLabel = (ctx, labelName) => {
  return ctx.octokit.issues.removeLabel({
    name: labelName,
    owner: ctx.payload.repository.owner.login,
    repo: ctx.payload.repository.name,
    issue_number: ctx.payload.issue.number,
  });
};

const addComment = (ctx, labelName) => {
  return ctx.octokit.issues.createComment(
    ctx.issue({ body: labelName + " attached !" })
  );
};

export default {
  "issues.labeled": (ctx) => {
    const attachedLabelName = ctx.payload.label.name;

    return Promise.all([
      removeLabel(ctx, attachedLabelName),
      addComment(ctx, attachedLabelName),
    ]);
  },
  "issues.unlabeled": (ctx) => {},
};
