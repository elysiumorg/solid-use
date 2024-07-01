<script setup>
import Meta from '../../src/components/meta.vue'
import Api from '../../src/components/api.vue'
import Demo from '../../src/components/demo.vue'


</script>

# {{ $params.name }}


<Meta :last-modified="$params.lastModified" :category="$params.category" />

{{ $params.description }}

```typescript-vue
import { {{ $params.name }} } from '@elysiumx/soliduse';
```

## Usage

```typescript-vue
{{ $params.usage }}
```

<Usage :code="$params.usage" />


## Demo

<Demo :hook="$params.name" />

## Api

<Api :apiParameters="$params.apiParameters" />
