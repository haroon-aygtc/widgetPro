import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UserAIModel, UserAIProvider } from "@/types/ai";

interface ConfiguredListProps {
  userProviders: UserAIProvider[];
  userModels: UserAIModel[];
}

export const ConfiguredList = ({ userProviders, userModels }: ConfiguredListProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Configured Providers</CardTitle>
          <CardDescription>Your active AI provider configurations.</CardDescription>
        </CardHeader>
        <CardContent>
          {userProviders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No providers configured yet.
            </p>
          ) : (
            <div className="space-y-4">
              {userProviders.map((userProvider) => (
                <div
                  key={userProvider.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {userProvider.provider?.display_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{userProvider.provider?.display_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            userProvider.test_status === "success"
                              ? "default"
                              : "destructive"
                          }
                          className="text-xs"
                        >
                          {userProvider.test_status}
                        </Badge>
                        {userProvider.provider?.is_free && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 text-xs"
                          >
                            Free
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {userProvider.last_tested_at && (
                      <p>
                        Last tested: {new Date(userProvider.last_tested_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My AI Models</CardTitle>
          <CardDescription>Models you've added to your collection.</CardDescription>
        </CardHeader>
        <CardContent>
          {userModels.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No models added yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userModels.map((userModel) => (
                <div key={userModel.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {userModel.custom_name || userModel.model?.display_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {userModel.model?.provider?.display_name}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {userModel.model?.is_free && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 text-xs"
                          >
                            Free
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {userModel.model?.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {userModel.model.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
