{{/*
Generate Kubernetes Deployment
*/}}

{{- define "immigration-system.deployment" }}

apiVersion: apps/v1
kind: Deployment

metadata:
  name: {{ .name }}
  namespace: {{ .root.Values.namespace }}

  labels:
    {{- include "immigration-system.labels" .root | nindent 4 }}

    app.kubernetes.io/component: {{ .name }}

spec:

  replicas: {{ .config.replicas }}

  selector:
    matchLabels:
      app.kubernetes.io/component: {{ .name }}

  template:

    metadata:
      labels:
        app.kubernetes.io/component: {{ .name }}

    spec:

      containers:

        - name: {{ .name }}

          image: "{{ .config.image.repository }}:{{ .config.image.tag }}"

          imagePullPolicy: {{ .root.Values.imagePullPolicy }}

          ports:
            - containerPort: {{ .config.container.port }}

          {{- if .config.env }}

          env:

            {{- toYaml .config.env | nindent 12 }}

          {{- end }}

          resources:
            {{- toYaml .config.resources | nindent 12 }}
        
          {{- if .config.probes }}

            {{ include "immigration-system.probes" .config | nindent 10 }}
        
          {{- end }}
    
{{- end }}