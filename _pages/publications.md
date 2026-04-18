---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

{% if site.author.googlescholar %}
  <div class="wordwrap">You can also find my articles on <a href="{{site.author.googlescholar}}">my Google Scholar profile</a>.</div>
{% endif %}

{% include base_path %}

## Open Source Contributions

### pgmpy

Contributed to the development of pgmpy by implementing new features, fixing bugs, and improving documentation.

[GitHub Repository](https://github.com/pgmpy/pgmpy)

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}
